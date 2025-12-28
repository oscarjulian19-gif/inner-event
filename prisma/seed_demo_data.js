const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Demo Data for verification...');

    // Target IKUSI for this run
    const tenant = await prisma.tenant.findUnique({
        where: { domain: 'ikusi.com' }
    });

    if (!tenant) {
        console.error('Tenant IKUSI not found. Run standard seed first.');
        return;
    }

    // Find the Mega (from previous seed) or create one
    let mega = await prisma.mega.findFirst({
        where: { tenantId: tenant.id }
    });

    if (!mega) {
        console.log('Creating Mega...');
        const purpose = await prisma.purpose.create({
            data: { statement: "To be the #1 Health Provider", tenantId: tenant.id }
        });
        mega = await prisma.mega.create({
            data: {
                statement: "Impact 5 Million Lives by 2026",
                deadline: new Date('2026-12-31'),
                purposeId: purpose.id,
                tenantId: tenant.id
            }
        });
    }

    console.log(`Using Mega: ${mega.statement}`);

    // Create 2 Objectives
    for (let i = 1; i <= 2; i++) {
        console.log(`  Creating Objective ${i}...`);
        const objective = await prisma.objective.create({
            data: {
                statement: `Strategic Objective ${i}: Enhance Service Delivery`,
                description: "Focus on speed and quality",
                megaId: mega.id,
                tenantId: tenant.id
            }
        });

        // Create 2 KRs per Objective
        for (let j = 1; j <= 2; j++) {
            console.log(`    Creating KR ${j} for Obj ${i}...`);
            const kr = await prisma.keyResult.create({
                data: {
                    statement: `KR ${i}.${j}: Increase Satisfaction to ${80 + j}%`,
                    targetValue: 80 + j,
                    metricUnit: '%',
                    objectiveId: objective.id,
                    tenantId: tenant.id
                }
            });

            // Create 3 Initiatives per KR
            for (let k = 1; k <= 3; k++) {
                const progress = Math.floor(Math.random() * 100); // Random progress
                const status = progress === 100 ? 'DONE' : (progress > 0 ? 'IN_PROGRESS' : 'TODO');

                await prisma.initiative.create({
                    data: {
                        title: `Initiative ${i}.${j}.${k}: Implement Module X`,
                        description: "Implementation details...",
                        keyResultId: kr.id,
                        horizon: 'H1',
                        progress: progress,
                        status: status,
                        tenantId: tenant.id
                    }
                });
            }
        }
    }

    console.log('✅ Demo Data Added Successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
