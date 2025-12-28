import { prisma } from '../prisma';

type HardChoice = {
    type: 'KILL' | 'PIVOT' | 'DOUBLE_DOWN';
    reasonCode: 'zombie' | 'resourceHog' | 'breakout'; // i18n key
    reasonParams: Record<string, string | number>;   // Params for interpolation
    relatedEntityId: string; // KR ID or Initiative ID
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
};

export async function analyzeEmergentStrategy(tenantId: string): Promise<HardChoice[]> {
    const hardChoices: HardChoice[] = [];

    // Fetch KRs and Initiatives
    const keyResults = await prisma.keyResult.findMany({
        where: { tenantId },
        include: { initiatives: true }
    });

    // Mock Time Elapsed (e.g., we are 60 days into a 90 day quarter)
    const daysInQuarter = 90;
    const currentDay = 60; // Mocked
    const timeProgress = currentDay / daysInQuarter; // 0.66

    for (const kr of keyResults) {
        const target = kr.targetValue;
        const current = kr.currentValue;
        const krProgress = target > 0 ? current / target : 0;

        // Logic 1: Zombie Projects (High Time, Low Progress)
        if (timeProgress > 0.6 && krProgress < 0.3) {
            hardChoices.push({
                type: 'KILL',
                reasonCode: 'zombie',
                reasonParams: {
                    statement: kr.statement,
                    progress: (krProgress * 100).toFixed(1),
                    time: (timeProgress * 100).toFixed(0)
                },
                relatedEntityId: kr.id,
                severity: 'HIGH'
            });
        }

        // Logic 2: Resource Hog (Many initiatives, low KR impact)
        const activeInitiatives = kr.initiatives.filter(i => i.status === 'IN_PROGRESS').length;
        if (activeInitiatives > 3 && krProgress < 0.2) {
            hardChoices.push({
                type: 'PIVOT',
                reasonCode: 'resourceHog',
                reasonParams: {
                    statement: kr.statement,
                    count: activeInitiatives
                },
                relatedEntityId: kr.id,
                severity: 'MEDIUM'
            });
        }
    }

    // Logic 3: H2/H3 Breakout (Emerging Strategy)
    const emergingInitiatives = await prisma.initiative.findMany({
        where: {
            tenantId,
            horizon: { in: ['H2', 'H3'] },
            progress: { gt: 80 } // Almost done
        }
    });

    for (const init of emergingInitiatives) {
        hardChoices.push({
            type: 'DOUBLE_DOWN',
            reasonCode: 'breakout',
            reasonParams: {
                title: init.title
            },
            relatedEntityId: init.id,
            severity: 'HIGH'
        });
    }

    return hardChoices;
}
