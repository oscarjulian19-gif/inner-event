const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSpanishDataForTenant(domain) {
    console.log(`\nStarting Spanish Seed for: ${domain}...`);

    const tenant = await prisma.tenant.findUnique({
        where: { domain }
    });

    if (!tenant) {
        console.error(`Tenant ${domain} not found.`);
        return;
    }

    // 1. Clean Strategy Data for this Tenant (to ensure clean Spanish state)
    console.log('  Cleaning old strategy data...');
    // Delete bottom-up to avoid foreign key constraints
    await prisma.kanbanTask.deleteMany({ where: { tenantId: tenant.id } });
    await prisma.initiative.deleteMany({ where: { tenantId: tenant.id } });
    await prisma.keyResult.deleteMany({ where: { tenantId: tenant.id } });
    await prisma.objective.deleteMany({ where: { tenantId: tenant.id } });
    await prisma.mega.deleteMany({ where: { tenantId: tenant.id } });
    await prisma.purpose.deleteMany({ where: { tenantId: tenant.id } });

    // 2. Create Purpose & Mega (Spanish)
    console.log('  Creating Purpose & Mega...');
    const purpose = await prisma.purpose.create({
        data: {
            statement: "Ser el Proveedor de Salud #1 en Latam",
            tenantId: tenant.id
        }
    });

    const mega = await prisma.mega.create({
        data: {
            statement: "Impactar 5 Millones de Vidas para 2026",
            deadline: new Date('2026-12-31'),
            purposeId: purpose.id,
            tenantId: tenant.id
        }
    });

    // 3. Create Strategic Structure
    const objectivesData = [
        {
            statement: "Excelencia Operacional y Servicio",
            description: "Optimizar tiempos y calidad de atención",
            krs: [
                { statement: "Aumentar NPS de 40 a 70", target: 70 },
                { statement: "Reducir tiempo de espera a < 10min", target: 10 }
            ]
        },
        {
            statement: "Crecimiento Digital Exponencial",
            description: "Capturar mercado a través de canales digitales",
            krs: [
                { statement: "Alcanzar 1M de usuarios activos en App", target: 1000000 },
                { statement: "Lograr 50% de ventas por canal digital", target: 50 }
            ]
        }
    ];

    for (const objData of objectivesData) {
        console.log(`  Creating Objective: ${objData.statement}`);
        const obj = await prisma.objective.create({
            data: {
                statement: objData.statement,
                description: objData.description,
                megaId: mega.id,
                tenantId: tenant.id
            }
        });

        for (const krData of objData.krs) {
            console.log(`    Creating KR: ${krData.statement}`);
            const kr = await prisma.keyResult.create({
                data: {
                    statement: krData.statement,
                    targetValue: krData.target,
                    metricUnit: krData.statement.includes('%') ? '%' : 'Users',
                    objectiveId: obj.id,
                    tenantId: tenant.id
                }
            });

            // Create Initiatives (3 per KR)
            const initiativesData = [
                { title: "Implementar Nuevo CRM", horizon: "H1" },
                { title: "Lanzamiento Campaña Q3", horizon: "H1" },
                { title: "Investigación IA Generativa", horizon: "H2" }
            ];

            for (const initData of initiativesData) {
                console.log(`      Creating Initiative: ${initData.title}`);
                const init = await prisma.initiative.create({
                    data: {
                        title: initData.title,
                        keyResultId: kr.id,
                        horizon: initData.horizon,
                        status: 'TODO', // Will update based on tasks
                        tenantId: tenant.id
                    }
                });

                // Create Kanban Tasks (Spanish)
                const tasksData = [
                    { title: "Definir Requisitos funcionales", status: "DONE" },
                    { title: "Diseñar wireframes UX/UI", status: "DONE" },
                    { title: "Desarrollo Backend API", status: "IN_PROGRESS" },
                    { title: "Pruebas de Integración", status: "TODO" },
                    { title: "Despliegue a Producción", status: "TODO" }
                ];

                for (const taskData of tasksData) {
                    await prisma.kanbanTask.create({
                        data: {
                            title: taskData.title,
                            status: taskData.status,
                            initiativeId: init.id,
                            tenantId: tenant.id
                        }
                    });
                }

                // Calculate Progress
                const total = tasksData.length;
                const done = tasksData.filter(t => t.status === 'DONE').length;
                const progress = Math.round((done / total) * 100);
                const status = progress === 100 ? 'DONE' : (progress > 0 ? 'IN_PROGRESS' : 'TODO');

                await prisma.initiative.update({
                    where: { id: init.id },
                    data: { progress, status }
                });
            }
        }
    }
}

async function main() {
    await seedSpanishDataForTenant('compensar.com');
    await seedSpanishDataForTenant('ikusi.com');
    console.log('\n✅ Spanish Full Data Seed Completed for both Tenants!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
