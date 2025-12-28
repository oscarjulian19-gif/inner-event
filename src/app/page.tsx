import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import HomePageClient from './HomePageClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cookieStore = await cookies();
  const tenantId = cookieStore.get('inner_event_tenant_id')?.value;

  let purpose = null;

  if (tenantId) {
    // Fetch Purpose and full Cascade Tree (L1 -> L2 -> L3)
    // Reusing the query from Planning Page
    purpose = await prisma.purpose.findFirst({
      where: { tenantId, type: 'COMPANY' }, // Always start from Company Purpose
      include: {
        megas: {
          include: {
            objectives: {
              where: { parentObjectiveId: null }, // Only Top Level Objectives directly under Mega
              include: {
                keyResults: {
                  include: {
                    initiatives: {
                      select: { id: true, progress: true, status: true, title: true }
                    }
                  }
                },
                childObjectives: { // Level 2
                  include: {
                    owner: true,
                    keyResults: {
                      include: {
                        initiatives: { select: { id: true, progress: true, status: true, title: true } }
                      }
                    },
                    childObjectives: { // Level 3
                      include: {
                        owner: true,
                        keyResults: {
                          include: {
                            initiatives: { select: { id: true, progress: true, status: true, title: true } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  return (
    <HomePageClient purpose={purpose} />
  );
}
