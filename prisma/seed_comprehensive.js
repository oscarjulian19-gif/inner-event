const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Data Helpers
const VERBS = ['Optimizar', 'Recientes', 'Acelerar', 'Transformar', 'Liderar', 'Expandir', 'Dominar', 'Innovar', 'Garantizar', 'Maximizando'];
const NOUNS = ['Operaciones', 'Ventas', 'Mercado', 'Experiencia', 'Digital', 'Talento', 'Infraestructura', 'Logística', 'Servicios', 'Calidad'];
const INITIATIVES_VERBS = ['Implementar', 'Lanzar', 'Pilotear', 'Desarrollar', 'Diseñar', 'Auditar', 'Capacitar', 'Contratar', 'Migrar', 'Automatizar'];
const KPI_UNITS = ['%', 'Millones', 'Clientes', 'Puntos', 'Horas', 'Sedes'];

function randomTitle(verbs, nouns) {
    const v = verbs[Math.floor(Math.random() * verbs.length)];
    const n = nouns[Math.floor(Math.random() * nouns.length)];
    return `${v} ${n} ${Math.floor(Math.random() * 2025)}`;
}

async function seedComprehensiveForTenant(domain, brandingColor, l1User, l2User, l3User) {
    console.log(`\n🚀 Seeding Comprehensive Data for: ${domain}`);

    const tenant = await prisma.tenant.findUnique({ where: { domain } });
    if (!tenant) return console.error(`Tenant ${domain} not found.`);

    // 1. Clean Data
    console.log('  Cleaning old data...');
    try {
        await prisma.kanbanTask.deleteMany({ where: { tenantId: tenant.id } });
        await prisma.initiative.deleteMany({ where: { tenantId: tenant.id } });
        await prisma.keyResult.deleteMany({ where: { tenantId: tenant.id } });
        await prisma.objective.deleteMany({ where: { tenantId: tenant.id } });
        await prisma.mega.deleteMany({ where: { tenantId: tenant.id } });
        await prisma.purpose.deleteMany({ where: { tenantId: tenant.id } });
    } catch (e) { }

    // 2. Users (Upsert)
    const users = [l1User, l2User, l3User];
    const userIds = {}; // map email -> id

    // DISC Colors & Types Helpers
    const DISC_TYPES = [
        { color: 'RED', type: 'D', description: 'Dominante' },
        { color: 'YELLOW', type: 'I', description: 'Influyente' },
        { color: 'GREEN', type: 'S', description: 'Estable' },
        { color: 'BLUE', type: 'C', description: 'Concienzudo' }
    ];

    for (let i = 0; i < users.length; i++) {
        const u = users[i];
        const created = await prisma.user.upsert({
            where: { email: u.email },
            update: { hierarchyLevel: i + 1, role: i === 0 ? 'ADMIN' : 'USER', name: u.name },
            create: {
                email: u.email,
                name: u.name,
                password: '12345',
                tenantId: tenant.id,
                hierarchyLevel: i + 1,
                role: i === 0 ? 'ADMIN' : 'USER'
            }
        });
        userIds[i + 1] = created.id;

        // Create random DISC Profile for user if not exists
        const disc = DISC_TYPES[Math.floor(Math.random() * DISC_TYPES.length)];
        // Upsert DISC
        const existingDisc = await prisma.discProfile.findUnique({ where: { userId: created.id } });
        if (!existingDisc) {
            await prisma.discProfile.create({
                data: {
                    userId: created.id,
                    color: disc.color,
                    scores: JSON.stringify({ type: disc.type, desc: disc.description })
                }
            });
        }
    }

    // 3. Hierarchy Generation Function
    const createObjectives = async (level, parentObjId, ownerId) => {
        // 3 Objectives per Level/Parent
        const objectives = [];
        for (let i = 1; i <= 3; i++) {
            const obj = await prisma.objective.create({
                data: {
                    statement: `L${level} Obj ${i}: ${randomTitle(VERBS, NOUNS)}`,
                    description: "Generado automáticamente para el ejercicio.",
                    parentObjectiveId: parentObjId || null,
                    // If level 1, link to MEGA (will fix mega relation later or ignore for specific L1)
                    ownerId: ownerId,
                    tenantId: tenant.id
                }
            });
            objectives.push(obj);

            // 2 KRs per Objective
            for (let k = 1; k <= 2; k++) {
                const kr = await prisma.keyResult.create({
                    data: {
                        statement: `L${level} KR ${i}.${k}: Alcanzar ${Math.floor(Math.random() * 50) + 50} en Indicador`,
                        targetValue: 100,
                        metricUnit: KPI_UNITS[Math.floor(Math.random() * KPI_UNITS.length)],
                        objectiveId: obj.id,
                        ownerId: ownerId,
                        tenantId: tenant.id
                    }
                });

                // 3 Initiatives per KR
                for (let init = 1; init <= 3; init++) {

                    // AUTO-TEAM Logic (Simulating AI)
                    // We'll create a team specifically for this initiative or reuse. For demo, let's create dynamic small teams.
                    // Pick 2 random users for the team
                    const teamMembers = [];
                    const availableUserIds = Object.values(userIds);
                    const member1 = availableUserIds[Math.floor(Math.random() * availableUserIds.length)];
                    let member2 = availableUserIds[Math.floor(Math.random() * availableUserIds.length)];
                    while (member2 === member1) { member2 = availableUserIds[Math.floor(Math.random() * availableUserIds.length)]; } // Ensure distinct

                    // Generate AI Reasoning based on profiles (Simplified for seed)
                    const reasoningOptions = [
                        "La IA sugiere este equipo por la alta complementariedad entre el perfil Ejecutor (Rojo) y el Analítico (Azul), ideal para iniciativas de optimización.",
                        "Equipo balanceado: La visión estratégica del Líder se complementa con la capacidad de influencia del equipo comercial.",
                        "Sinergia detectada: Alta cohesión en perfiles Estables (Verde) para garantizar la continuidad operativa sin fricciones.",
                        "Recomendación IA: Este mix de perfiles garantiza velocidad de implementación (Rojo) manteniendo la calidad técnica (Azul)."
                    ];
                    const aiReasoning = reasoningOptions[Math.floor(Math.random() * reasoningOptions.length)];

                    const team = await prisma.team.create({
                        data: {
                            name: `Squad ${randomTitle(['Alfa', 'Beta', 'Gamma', 'Delta'], ['Force', 'Team', 'Unit'])}`,
                            tenantId: tenant.id,
                            aiReasoning: aiReasoning,
                            members: {
                                create: [
                                    { userId: member1, role: 'LEAD' },
                                    { userId: member2, role: 'MEMBER' }
                                ]
                            }
                        }
                    });

                    const initiative = await prisma.initiative.create({
                        data: {
                            title: `L${level} Init ${i}.${k}.${init}: ${randomTitle(INITIATIVES_VERBS, NOUNS)}`,
                            keyResultId: kr.id,
                            horizon: 'H1',
                            ownerId: ownerId,
                            tenantId: tenant.id,
                            teamId: team.id, // Linked to the Auto-Created Team
                            status: 'TODO',
                            progress: 0,
                            aiExplanation: "Iniciativa prioritaria por impacto en KR."
                        }
                    });

                    // 10 Tasks per Initiative
                    let doneCount = 0;
                    const tasksToCreate = [];
                    for (let t = 1; t <= 10; t++) {
                        // Random Status distribution weighted
                        const r = Math.random();
                        let status = 'TODO';
                        if (r > 0.6) status = 'DONE';
                        else if (r > 0.3) status = 'IN_PROGRESS';

                        if (status === 'DONE') doneCount++;

                        tasksToCreate.push({
                            title: `Actividad ${t} para validar ${initiative.title}`,
                            status: status,
                            initiativeId: initiative.id,
                            tenantId: tenant.id,
                            assigneeId: member1 // Assign to team lead for simplicity
                        });
                    }

                    await prisma.kanbanTask.createMany({ data: tasksToCreate });

                    // Update Initiative Progress
                    const progress = Math.round((doneCount / 10) * 100);
                    const initStatus = progress === 100 ? 'DONE' : (progress > 0 ? 'IN_PROGRESS' : 'TODO');

                    await prisma.initiative.update({
                        where: { id: initiative.id },
                        data: { progress, status: initStatus }
                    });
                }
            }
        }
        return objectives;
    };

    // --- EXECUTE HIERARCHY ---

    // L1: Company Purpose & Mega
    const p1 = await prisma.purpose.create({
        data: { statement: `Propósito Superior ${domain}`, type: 'COMPANY', ownerId: userIds[1], tenantId: tenant.id }
    });
    const m1 = await prisma.mega.create({
        data: { statement: "MEGA 2030: Liderazgo Total", deadline: new Date('2030-01-01'), purposeId: p1.id, tenantId: tenant.id }
    });

    // L1 Objectives
    console.log("  Generating L1 Structure...");
    const l1Objectives = await createObjectives(1, null, userIds[1]);

    // Link L1 Objs to Mega
    for (const obj of l1Objectives) {
        await prisma.objective.update({ where: { id: obj.id }, data: { megaId: m1.id } });

        // L2 Objectives (Children of L1)
        console.log(`    Generating L2 Structure for Obj ${obj.id.slice(0, 4)}...`);
        const l2Objectives = await createObjectives(2, obj.id, userIds[2]);

        // L3 Objectives (Children of L2)
        for (const objL2 of l2Objectives) {
            // console.log(`      Generating L3 Structure for Obj L2 ${objL2.id.slice(0,4)}...`);
            await createObjectives(3, objL2.id, userIds[3]);
        }
    }

    // Create L2/L3 Purposes (Areas)
    await prisma.purpose.create({ data: { statement: "Propósito Área Táctica (L2)", type: 'AREA', ownerId: userIds[2], tenantId: tenant.id } });
    await prisma.purpose.create({ data: { statement: "Propósito Equipo Operativo (L3)", type: 'TEAM', ownerId: userIds[3], tenantId: tenant.id } });

    console.log(`  ✅ Comprehensive Data Created for ${domain}`);
}

async function main() {
    // COMPENSAR (Naranja)
    await seedComprehensiveForTenant(
        'compensar.com',
        'orange',
        { email: 'sebastian.galindo@compensar.com', name: 'Sebastian GM' },
        { email: 'carlos.nivel2@compensar.com', name: 'Carlos Táctico' },
        { email: 'pedro.nivel3@compensar.com', name: 'Pedro Operativo' }
    );

    // IKUSI (Verde)
    await seedComprehensiveForTenant(
        'ikusi.com',
        'green',
        { email: 'cesar.villamil@ikusi.com', name: 'Cesar GM' },
        { email: 'carlos.nivel2@ikusi.com', name: 'Carlos Táctico' },
        { email: 'pedro.nivel3@ikusi.com', name: 'Pedro Operativo' }
    );
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
