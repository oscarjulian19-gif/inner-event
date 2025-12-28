import { prisma } from '@/lib/prisma';
import AnalyticsClient from './AnalyticsClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const cookieStore = await cookies();
    const tenantId = cookieStore.get('inner_event_tenant_id')?.value;

    if (!tenantId) {
        redirect('/login');
    }

    // Fetch Data for Analysis
    const initiatives = await prisma.initiative.findMany({
        where: { tenantId },
        orderBy: { updatedAt: 'desc' }
    });

    // Categorization Logic (Mock AI Analysis)
    const completedInitiatives = initiatives.filter(i => i.status === 'DONE' || i.progress === 100);

    // Stalled: In Progress but hasn't moved much? (Simplification: In Progress with < 50% progress)
    const stalledInitiatives = initiatives.filter(i => i.status === 'IN_PROGRESS' && i.progress < 30);

    // At Risk: Simplification -> TODO items created long ago? Or just random for demo if no dates?
    // Let's use: In Progress < 70%
    const atRiskInitiatives = initiatives.filter(i => i.status === 'IN_PROGRESS' && i.progress >= 30 && i.progress < 70);

    // Recent Wins: Just completed ones or high progress
    // Let's verify overlapping categories don't look weird.
    // Completed = Logrado.
    // Stalled = Aprendimos (Why is it stuck?).
    // At Risk = Riesgo.
    // Celebrate = High progress (> 80%) even if not done.
    const recentWins = initiatives.filter(i => i.progress > 80);

    const data = {
        completedInitiatives,
        stalledInitiatives,
        atRiskInitiatives,
        recentWins,
        totalInitiatives: initiatives.length
    };

    return <AnalyticsClient data={data} />;
}
