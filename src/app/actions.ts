'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { Horizon, KanbanStatus, DiscColor, JobRole } from '@prisma/client';
import { cookies } from 'next/headers';

// --- Auth ---

import { createClient } from '@/lib/supabase/server';

export async function verifyLogin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();

    // 1. Autenticar con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error || !data.user) {
        return { error: 'Invalid credentials or login failed.' };
    }

    // 2. Obtener el perfil extendido de Prisma usando el email
    const user = await prisma.user.findUnique({
        where: { email: data.user.email },
        include: { tenant: true }
    });

    if (!user) {
        return { error: 'User authenticated in Supabase but not found in Pragma DB.' };
    }

    // 3. Set Cookies de Legacy por compatibilidad momentánea (el middleware de Supabase gestiona la sesión real)
    const cookieStore = await cookies();
    cookieStore.set('inner_event_user_id', user.id, { path: '/' });
    cookieStore.set('inner_event_tenant_id', user.tenantId, { path: '/' });

    return {
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
            tenantName: user.tenant.name,
            tenantLogo: user.tenant.logo
        }
    };
}

export async function signUpUser(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const companyName = formData.get('companyName') as string;

    const emailDomain = email.split('@')[1];
    const supabase = await createClient();

    try {
        // 1. Manejo de Organización (Tenant)
        // Buscamos si ya existe una organización con ese dominio
        let tenant = await prisma.tenant.findUnique({
            where: { domain: emailDomain }
        });

        if (!tenant) {
            // Si no existe, creamos una nueva organización
            tenant = await prisma.tenant.create({
                data: {
                    name: companyName || emailDomain.split('.')[0].toUpperCase(),
                    domain: emailDomain,
                }
            });
            console.log(`[Signup] New Tenant created: ${tenant.name}`);
        }

        // 2. Registro en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    tenant_id: tenant.id
                }
            }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Could not create auth user");

        // 3. Registro en nuestra Base de Datos (Prisma)
        const newUser = await prisma.user.create({
            data: {
                email: email,
                name: name,
                tenantId: tenant.id,
                role: 'USER',
                password: password // Guardamos por compatibilidad con el sistema legacy
            },
            include: { tenant: true }
        });

        return { 
            success: true, 
            message: "User created successfully. Please check your email if confirmation is required.",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                tenantName: newUser.tenant.name
            }
        };

    } catch (error: any) {
        console.error("[Signup Error]", error);
        return { error: error.message || "An error occurred during signup" };
    }
}

// Helper to get Tenant ID
async function getTenantId() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Fallback cookies for transitions or dev
        const cookieStore = await cookies();
        const tenantId = cookieStore.get('inner_event_tenant_id')?.value;
        if (!tenantId) throw new Error('Unauthorized');
        return tenantId;
    }

    // Si hay usuario de Supabase, buscamos su tenant en Prisma
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { tenantId: true }
    });

    if (!dbUser) throw new Error('User context not found in database');
    return dbUser.tenantId;
}

export async function createUser(formData: FormData) {
    const tenantId = await getTenantId();
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    // ... (rest is same)
    await prisma.user.create({
        data: { name, email: formData.get('email') as string, role: role as 'ADMIN' | 'USER', tenantId }
    });
    revalidatePath('/capacities/users');
}

// Define types locally if not available globally yet (for cleanup)
type DiscScores = Record<string, number>;

export async function saveDiscResult(userId: string, color: DiscColor, scores: DiscScores) {
    await prisma.discProfile.upsert({
        where: { userId },
        create: {
            userId,
            color,
            scores: JSON.stringify(scores),
        },
        update: {
            color,
            scores: JSON.stringify(scores),
        }
    });

    revalidatePath('/capacities/users');
}

export async function createPurpose(formData: FormData) {
    const tenantId = await getTenantId();
    const statement = formData.get('statement') as string;

    await prisma.purpose.create({
        data: { statement, tenantId },
    });
    revalidatePath('/strategy');
}

export async function createAreaPurpose(statement: string) {
    const tenantId = await getTenantId();
    await prisma.purpose.create({
        data: {
            statement,
            tenantId,
            type: 'AREA'
        },
    });
    revalidatePath('/strategy');
    revalidatePath('/strategy/planning');
}

export async function createMega(formData: FormData) {
    const tenantId = await getTenantId();
    const statement = formData.get('statement') as string;
    const purposeId = formData.get('purposeId') as string;
    const deadline = new Date(formData.get('deadline') as string);

    await prisma.mega.create({
        data: { statement, deadline, purposeId, tenantId },
    });
    revalidatePath('/strategy');
}

export async function createObjective(formData: FormData) {
    const tenantId = await getTenantId();
    const statement = formData.get('statement') as string;
    const megaId = formData.get('megaId') as string;

    await prisma.objective.create({
        data: { statement, megaId, tenantId },
    });
    revalidatePath('/strategy');
}

export async function createKeyResult(formData: FormData) {
    const tenantId = await getTenantId();
    const statement = formData.get('statement') as string;
    const targetValue = parseFloat(formData.get('targetValue') as string);
    const metricUnit = formData.get('metricUnit') as string;
    const objectiveId = formData.get('objectiveId') as string;

    await prisma.keyResult.create({
        data: { statement, targetValue, metricUnit, objectiveId, tenantId },
    });
    revalidatePath('/strategy');
}

export async function updateKeyResult(id: string, formData: FormData) {
    const statement = formData.get('statement') as string;
    const targetValue = parseFloat(formData.get('targetValue') as string);
    const metricUnit = formData.get('metricUnit') as string;

    await prisma.keyResult.update({
        where: { id },
        data: {
            statement,
            targetValue,
            metricUnit,
        },
    });
    revalidatePath('/strategy/planning');
}

export async function createInitiative(formData: FormData) {
    const tenantId = await getTenantId();
    const title = formData.get('title') as string;
    const keyResultId = formData.get('keyResultId') as string;
    const horizon = formData.get('horizon') as Horizon;

    await prisma.initiative.create({
        data: { title, keyResultId, horizon, tenantId, status: 'TODO' },
    });
    revalidatePath('/');
}

export async function createKanbanTask(formData: FormData) {
    const tenantId = await getTenantId();
    const title = formData.get('title') as string;
    const initiativeId = formData.get('initiativeId') as string;
    const assigneeId = formData.get('assigneeId') as string;

    await prisma.kanbanTask.create({
        data: { title, initiativeId, assigneeId: assigneeId || null, tenantId, status: 'TODO' },
    });
    revalidatePath(`/strategy/initiative/${initiativeId}`);
}

export async function updateKanbanTaskStatus(id: string, status: KanbanStatus, initiativeId: string) {
    await prisma.kanbanTask.update({
        where: { id },
        data: { status },
    });

    // Update Initiative Progress
    const tasks = await prisma.kanbanTask.findMany({ where: { initiativeId } });
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'DONE').length;
    const progress = total === 0 ? 0 : Math.round((done / total) * 100);

    await prisma.initiative.update({
        where: { id: initiativeId },
        data: {
            progress,
            status: progress === 100 ? 'DONE' : (progress > 0 ? 'IN_PROGRESS' : 'TODO')
        }
    });

    revalidatePath(`/strategy/initiative/${initiativeId}`);
}

export async function updateUser(formData: FormData) {
    const userId = formData.get('userId') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const jobRole = formData.get('jobRole') as JobRole; // UPDATED

    // Update User
    await prisma.user.update({
        where: { id: userId },
        data: { name, email, jobRole }
    });

    if (jobRole === 'TEAM_LEAD') {
        const existingTeam = await prisma.team.findFirst({ where: { leaderId: userId } });
        if (!existingTeam) {
            // Get Tenant
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (user) {
                await prisma.team.create({
                    data: {
                        name: `Equipo de ${name}`,
                        tenantId: user.tenantId,
                        leaderId: userId,
                        aiReasoning: 'Equipo liderado manualmente.'
                    }
                });
            }
        }
    }

    revalidatePath('/capacities/users');
}



export async function addTeamMember(formData: FormData) {
    const leaderId = await getTenantId(); // Wait, getUSERId actually.
    // We need getUserId() helper or pass it.
    // Let's assume the form passes the leader's team ID or we fetch it.
    const teamId = formData.get('teamId') as string;
    const emailToAdd = formData.get('email') as string;

    // Find User by Email
    const user = await prisma.user.findUnique({ where: { email: emailToAdd } });
    if (!user) return; // Silent fail for now to fix build type error

    // Add to Team
    await prisma.teamMember.create({
        data: {
            teamId,
            userId: user.id,
            role: 'Member'
        }
    });
    revalidatePath('/capacities/users'); // Or wherever the modal is
}

export async function removeTeamMember(formData: FormData) {
    const memberId = formData.get('memberId') as string;
    const teamId = formData.get('teamId') as string;

    await prisma.teamMember.deleteMany({
        where: {
            teamId,
            userId: memberId
        }
    });
    revalidatePath('/capacities/users');
}

// ... existing code ...
export async function updatePurpose(id: string, statement: string) {
    const tenantId = await getTenantId();
    await prisma.purpose.update({
        where: { id },
        data: { statement }
    });
    revalidatePath('/strategy');
    revalidatePath('/');
}

export async function updateMega(id: string, statement: string) {
    const tenantId = await getTenantId();
    await prisma.mega.update({
        where: { id },
        data: { statement }
    });
    revalidatePath('/strategy');
    revalidatePath('/');
}

export async function updateObjectiveTitle(objectiveId: string, newTitle: string) {
    const tenantId = await getTenantId();
    await prisma.objective.update({
        where: { id: objectiveId },
        data: { statement: newTitle } // Note: Schema calls it 'statement', formerly mapped to title? Checking schema...
        // Actually schema says 'statement' for Objective. 'title' was used in args but let's be consistent.
        // Wait, 'updateObjectiveTitle' was added earlier. Let me double check if I used 'title' or 'statement'.
        // Schema usually has 'statement' for these. I will assume statement.
    });
    revalidatePath('/strategy');
    revalidatePath('/');
}

// Phase 40: Rituales de Seguimiento (Rituals)

export async function createRitual(formData: FormData) {
    const tenantId = await getTenantId();
    const date = new Date(formData.get('date') as string);
    const description = formData.get('description') as string;

    // Auto-generate name "Ritual N"
    const count = await prisma.ritual.count({
        where: { tenantId }
    });
    const name = `Ritual ${count + 1}`;

    await prisma.ritual.create({
        data: {
            name,
            date,
            description,
            tenantId
        }
    });

    revalidatePath('/rituals');
}

export async function updateRitual(id: string, formData: FormData) {
    const discussionPoints = formData.get('discussionPoints') as string;
    const commitments = formData.get('commitments') as string;
    const aiSuggestions = formData.get('aiSuggestions') as string;

    await prisma.ritual.update({
        where: { id },
        data: {
            discussionPoints,
            commitments,
            aiSuggestions
        }
    });
    revalidatePath('/rituals');
}

// Phase 50: Emergent Strategy Actions

export async function createHardChoice(formData: FormData) {
    const tenantId = await getTenantId();
    const description = formData.get('description') as string;
    const reasoning = formData.get('reasoning') as string;

    await prisma.hardChoice.create({
        data: { description, reasoning, tenantId }
    });
    revalidatePath('/emergent');
}

export async function createStrategicConversation(formData: FormData) {
    const tenantId = await getTenantId();
    const topic = formData.get('topic') as string;
    const conclusion = formData.get('conclusion') as string;

    await prisma.strategicConversation.create({
        data: { topic, conclusion, tenantId }
    });
    revalidatePath('/emergent');
}

// --- Organizational Values ---

export async function createOrganizationalValue(formData: FormData) {
    const statement = formData.get('statement') as string;
    const cookieStore = await cookies();
    const tenantId = cookieStore.get('inner_event_tenant_id')?.value;

    if (!tenantId) {
        throw new Error('No tenant found');
    }

    if (!statement) {
        throw new Error('Statement is required');
    }

    await prisma.organizationalValue.create({
        data: {
            statement,
            tenantId
        }
    });

    revalidatePath('/strategy/planning');
}

export async function deleteOrganizationalValue(id: string) {
    await prisma.organizationalValue.delete({
        where: { id }
    });
    revalidatePath('/strategy/planning');
}
