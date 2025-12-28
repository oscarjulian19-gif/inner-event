const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const initiatives = await prisma.initiative.findMany();

    if (initiatives.length === 0) {
        console.log('No initiatives found. Please run main seed first or create one in UI.');
        return;
    }

    const tasks = [
        'Definir alcance del MVP',
        'Reunión de kickoff con stakeholders',
        'Diseñar arquitectura de base de datos',
        'Configurar entorno de desarrollo',
        'Implementar autenticación de usuarios',
        'Realizar pruebas de carga',
        'Documentar API',
        'Desplegar en staging'
    ];

    for (const initiative of initiatives) {
        // Check if it has tasks
        const existingTasks = await prisma.kanbanTask.count({ where: { initiativeId: initiative.id } });

        if (existingTasks === 0) {
            console.log(`Seeding tasks for initiative: ${initiative.title}`);

            // Add 3-5 random tasks
            const numTasks = Math.floor(Math.random() * 3) + 3;

            for (let i = 0; i < numTasks; i++) {
                const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
                await prisma.kanbanTask.create({
                    data: {
                        title: randomTask,
                        initiativeId: initiative.id,
                        tenantId: 'default-tenant',
                        status: Math.random() > 0.7 ? 'DONE' : (Math.random() > 0.4 ? 'IN_PROGRESS' : 'TODO') // Random status
                    }
                });
            }

            // Update Initiative Progress
            const allTasks = await prisma.kanbanTask.findMany({ where: { initiativeId: initiative.id } });
            const done = allTasks.filter(t => t.status === 'DONE').length;
            const progress = Math.round((done / allTasks.length) * 100);

            await prisma.initiative.update({
                where: { id: initiative.id },
                data: {
                    progress,
                    status: progress === 100 ? 'DONE' : (progress > 0 ? 'IN_PROGRESS' : 'TODO')
                }
            });
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
