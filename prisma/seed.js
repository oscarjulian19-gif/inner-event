const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Multi-tenant Seed...');

  // 1. Clean existing data (optional, but good for idempotency)
  // Note: Standard SQLite doesn't have CASCADE truncate, so we delete in order
  // Delete in reverse order of dependencies
  await prisma.kanbanTask.deleteMany();
  await prisma.initiative.deleteMany();
  await prisma.keyResult.deleteMany();
  await prisma.objective.deleteMany();
  await prisma.mega.deleteMany();
  await prisma.purpose.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.discProfile.deleteMany();
  await prisma.user.deleteMany();
  
  // Delete RAG documents before tenants (they have tenantId FK)
  await prisma.document.deleteMany();
  
  await prisma.tenant.deleteMany();

  // --- Helpers ---
  const DISC_COLORS = ['RED', 'YELLOW', 'GREEN', 'BLUE'];
  const JOB_ROLES = ['TEAM_LEAD', 'MEMBER', 'SUPERVISOR'];
  const AREAS = ['Technology', 'Sales', 'HR', 'Finance', 'Operations'];
  const TITLES = ['Developer', 'Manager', 'Analyst', 'Specialist', 'Director'];

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  async function createCompany(name, domain, adminEmail, logo = null) {
    console.log(`Creating Tenant: ${name}...`);
    const tenant = await prisma.tenant.create({
      data: {
        name,
        domain,
        logo
      }
    });

    // Create Admin
    console.log(`Creating Admin: ${adminEmail}...`);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminEmail.split('@')[0].replace('.', ' '),
        lastName: 'Admin',
        tenantId: tenant.id,
        role: 'ADMIN',
        password: '12345',
        jobTitle: 'Administrator',
        area: 'Management',
        tenure: '5 years',
        age: 40,
        gender: 'Male',
        discProfile: {
          create: {
            color: getRandomItem(DISC_COLORS),
            scores: JSON.stringify({ D: 80, I: 50, S: 20, C: 60 })
          }
        }
      }
    });

    // Create 10 Users
    for (let i = 1; i <= 10; i++) {
      const email = `user${i}@${domain}`;
      await prisma.user.create({
        data: {
          email,
          name: `User ${i}`,
          lastName: `${name} Employee`,
          tenantId: tenant.id,
          role: 'USER',
          jobRole: getRandomItem(JOB_ROLES),
          password: '12345',
          jobTitle: getRandomItem(TITLES),
          area: getRandomItem(AREAS),
          tenure: `${Math.floor(Math.random() * 10) + 1} years`,
          age: Math.floor(Math.random() * 40) + 20,
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          discProfile: {
            create: {
              color: getRandomItem(DISC_COLORS),
              scores: JSON.stringify({ D: 50, I: 50, S: 50, C: 50 })
            }
          }
        }
      });
    }

    // Create a Generic Purpose & Mega for context
    const purpose = await prisma.purpose.create({
      data: {
        statement: `To be the leading ${name} provider`,
        tenantId: tenant.id
      }
    });

    const mega = await prisma.mega.create({
      data: {
        statement: `Reach 1M Customers by 2030`,
        deadline: new Date('2030-12-31'),
        purposeId: purpose.id,
        tenantId: tenant.id
      }
    });

    // Create Objectives
    const objs = [
      `Expand ${name} Market Share`,
      `Improve Customer Satisfaction`,
      `Launch New Innovation Product`
    ];

    for (const objStmt of objs) {
      const objective = await prisma.objective.create({
        data: {
          statement: objStmt,
          megaId: mega.id,
          tenantId: tenant.id
        }
      });

      // Create Key Results
      for (let k = 1; k <= 3; k++) {
        const kr = await prisma.keyResult.create({
          data: {
            statement: `Increase Metric ${k} for ${objStmt.split(' ')[0]}`,
            targetValue: 100 * k,
            metricUnit: '%',
            objectiveId: objective.id,
            tenantId: tenant.id
          }
        });

        // Create Initiatives
        const initiative = await prisma.initiative.create({
          data: {
            title: `Initiative for KR ${k}`,
            keyResultId: kr.id,
            tenantId: tenant.id,
            horizon: 'H1',
            status: 'IN_PROGRESS',
            progress: 30
          }
        });

        // Create Kanban Tasks
        await prisma.kanbanTask.create({
          data: {
            title: `Task 1 for ${initiative.title}`,
            initiativeId: initiative.id,
            tenantId: tenant.id,
            status: 'DONE'
          }
        });
        await prisma.kanbanTask.create({
          data: {
            title: `Task 2 for ${initiative.title}`,
            initiativeId: initiative.id,
            tenantId: tenant.id,
            status: 'TODO'
          }
        });
      }
    }
  }

  // 2. Create Compensar
  await createCompany('Compensar', 'compensar.com', 'william.galindo@compensar.com');

  // 3. Create IKUSI
  await createCompany('IKUSI', 'ikusi.com', 'oscar.gomez@ikusi.com');

  console.log('✅ Seeding Completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
