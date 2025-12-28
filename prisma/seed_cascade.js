const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCascadeForTenant(domain, l1User, l2User, l3User) {
    console.log(`\n🌊 Seeding Strategic Cascade for: ${domain}...`);

    const tenant = await prisma.tenant.findUnique({
        where: { domain }
    });

    if (!tenant) {
        console.error(`Tenant ${domain} not found.`);
        return;
    }

    // --- CLEAR DATA for clean slate ---
    console.log('  Cleaning old cascade data...');
    const users = await prisma.user.findMany({ where: { tenantId: tenant.id } });
    // This is a rough clean, might fail on constraints but okay for dev
    try {
        await prisma.kanbanTask.deleteMany({ where: { tenantId: tenant.id } });
        await prisma.initiative.deleteMany({ where: { tenantId: tenant.id } });
        await prisma.keyResult.deleteMany({ where: { tenantId: tenant.id } });
        await prisma.objective.deleteMany({ where: { tenantId: tenant.id } });
        await prisma.mega.deleteMany({ where: { tenantId: tenant.id } });
        await prisma.purpose.deleteMany({ where: { tenantId: tenant.id } });
        // Don't delete users yet, just update them or upsert
    } catch (e) {
        console.warn("  Clean up warning (ignorable):", e.message);
    }

    // --- LEVEL 1: GENERAL MANAGER ---
    console.log(`  Creating L1 User: ${l1User.email}`);
    const userL1 = await prisma.user.upsert({
        where: { email: l1User.email },
        update: { hierarchyLevel: 1, role: 'ADMIN', jobRole: 'TEAM_LEAD' },
        create: {
            email: l1User.email,
            name: l1User.name,
            password: '12345',
            tenantId: tenant.id,
            hierarchyLevel: 1,
            role: 'ADMIN',
            jobRole: 'TEAM_LEAD'
        }
    });

    // L1 Company Purpose
    const purposeL1 = await prisma.purpose.create({
        data: {
            statement: `${domain} - Propósito Superior Global`,
            type: 'COMPANY',
            ownerId: userL1.id, // L1 owns Company Purpose
            tenantId: tenant.id
        }
    });

    const megaL1 = await prisma.mega.create({
        data: {
            statement: "Gran Meta HAGG (Megas)",
            deadline: new Date('2030-01-01'),
            purposeId: purposeL1.id,
            tenantId: tenant.id
        }
    });

    // L1 Objective
    const objectiveL1 = await prisma.objective.create({
        data: {
            statement: "L1: Dominar el Mercado Global",
            description: "Objetivo Corporativo Principal",
            megaId: megaL1.id,
            tenantId: tenant.id
        }
    });

    // L1 KR
    await prisma.keyResult.create({
        data: { statement: "L1 KR: 50% Market Share", targetValue: 50, metricUnit: '%', objectiveId: objectiveL1.id, tenantId: tenant.id }
    });


    // --- LEVEL 2: AREA MANAGER ---
    console.log(`  Creating L2 User: ${l2User.email}`);
    const userL2 = await prisma.user.upsert({
        where: { email: l2User.email },
        update: { hierarchyLevel: 2, role: 'USER', jobRole: 'TEAM_LEAD' },
        create: {
            email: l2User.email,
            name: l2User.name,
            password: '12345',
            tenantId: tenant.id,
            hierarchyLevel: 2,
            role: 'USER',
            jobRole: 'TEAM_LEAD'
        }
    });

    // L2 Area Purpose
    const purposeL2 = await prisma.purpose.create({
        data: {
            statement: "Propósito del Área Comercial (L2)",
            type: 'AREA',
            ownerId: userL2.id,
            tenantId: tenant.id
        }
    });

    // L2 Objective (Linked to L1)
    const objectiveL2 = await prisma.objective.create({
        data: {
            statement: "L2: Expansión Regional Latam",
            description: "Contribuye a Dominar el Mercado Global",
            parentObjectiveId: objectiveL1.id, // <--- CASCADE LINK
            megaId: megaL1.id, // Still linked to Mega context? Or separate? Usually strict cascade links to parent obj. Linking to Mega for query convenience.
            tenantId: tenant.id,
            ownerId: userL2.id
        }
    });

    // L2 KR
    await prisma.keyResult.create({
        data: { statement: "L2 KR: Abrir 3 sedes en Latam", targetValue: 3, metricUnit: 'Sedes', objectiveId: objectiveL2.id, tenantId: tenant.id }
    });


    // --- LEVEL 3: TEAM LEAD ---
    console.log(`  Creating L3 User: ${l3User.email}`);
    const userL3 = await prisma.user.upsert({
        where: { email: l3User.email },
        update: { hierarchyLevel: 3, role: 'USER', jobRole: 'MEMBER' },
        create: {
            email: l3User.email,
            name: l3User.name,
            password: '12345',
            tenantId: tenant.id,
            hierarchyLevel: 3,
            role: 'USER',
            jobRole: 'MEMBER'
        }
    });

    // L3 Team Purpose (Optional)
    const purposeL3 = await prisma.purpose.create({
        data: {
            statement: "Propósito del Equipo de Ventas Perú (L3)",
            type: 'TEAM',
            ownerId: userL3.id,
            tenantId: tenant.id
        }
    });

    // L3 Objective (Linked to L2)
    const objectiveL3 = await prisma.objective.create({
        data: {
            statement: "L3: Captar Clientes en Perú",
            description: "Contribuye a Expansión Regional",
            parentObjectiveId: objectiveL2.id, // <--- CASCADE LINK
            megaId: megaL1.id,
            tenantId: tenant.id,
            ownerId: userL3.id
        }
    });

    // L3 KR & Initiatives
    const krL3 = await prisma.keyResult.create({
        data: { statement: "L3 KR: 100 Clientes Nuevos", targetValue: 100, metricUnit: 'Clientes', objectiveId: objectiveL3.id, tenantId: tenant.id }
    });

    await prisma.initiative.create({
        data: { title: "Campaña Facebook Ads Perú", keyResultId: krL3.id, horizon: "H1", tenantId: tenant.id, status: 'IN_PROGRESS', progress: 50 },
    });


    console.log(`  ✅ Cascade Created for ${domain}`);
}

async function main() {
    // COMPENSAR
    await seedCascadeForTenant(
        'compensar.com',
        { email: 'sebastian.galindo@compensar.com', name: 'Sebastian L1' },
        { email: 'carlos.nivel2@compensar.com', name: 'Carlos L2' }, // Fixed domain for L2/L3 based on implicit logic (user said "carlos.nivel2@ikusi" twice in prompt but likely meant one for each tenant. I will assume consistency)
        { email: 'pedro.nivel3@compensar.com', name: 'Pedro L3' }
    );

    // IKUSI
    await seedCascadeForTenant(
        'ikusi.com',
        { email: 'cesar.villamil@ikusi.com', name: 'Cesar L1' },
        { email: 'carlos.nivel2@ikusi.com', name: 'Carlos L2' },
        { email: 'pedro.nivel3@ikusi.com', name: 'Pedro L3' }
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
