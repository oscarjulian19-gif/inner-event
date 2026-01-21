const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncTestUser() {
    const email = 'test@pragma.com';
    
    // 1. Asegurar que existe el Tenant Pragma
    let tenant = await prisma.tenant.findUnique({
        where: { domain: 'pragma.com' }
    });

    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: {
                name: 'Pragma Test Org',
                domain: 'pragma.com'
            }
        });
        console.log("Created Tenant: Pragma Test Org");
    }

    // 2. Crear el usuario en Prisma
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Pragma Tester',
            password: 'password123', // Legacy compatibility
            role: 'ADMIN',
            tenantId: tenant.id
        }
    });

    console.log("User synced to Prisma:", user.email);
}

syncTestUser()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
