import { prisma } from '@/lib/prisma';
import StrategyDashboard from '@/components/Strategy/StrategyDashboard';
import StrategyTabs from '@/components/Strategy/StrategyTabs';
import StrategyCascade from '@/components/Strategy/StrategyCascade';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PlanningPage() {
    const cookieStore = await cookies();
    const tenantId = cookieStore.get('inner_event_tenant_id')?.value;

    if (!tenantId) {
        redirect('/login');
    }

    // Fetch Purpose and full Cascade Tree (L1 -> L2 -> L3)
    const purpose = await prisma.purpose.findFirst({
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

    const areaPurpose = await prisma.purpose.findFirst({
        where: { tenantId, type: 'AREA' },
        include: { megas: true }
    });

    const analysisData = {
        marketShare: 45,
        growthRate: 12,
        customerSatisfaction: 88,
        operationalEfficiency: 92
    };

    const organizationalValues = await prisma.organizationalValue.findMany({
        where: { tenantId }
    });

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* <StrategyTabs /> Removed as per user request to focus on Purpose */}
            {/* <StrategyCascade purpose={purpose} /> Moved inside Dashboard for Header Hierarchy */}
            <div style={{ marginTop: '1rem' }}>
                <StrategyDashboard
                    purpose={purpose}
                    areaPurpose={areaPurpose}
                    analysisData={analysisData}
                    organizationalValues={organizationalValues}
                />
            </div>
        </div>
    );
}
