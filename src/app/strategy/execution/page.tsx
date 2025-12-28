import { getKanbanBoard } from '@/lib/services/kanbanService';
import KanbanPageClient from '@/components/Kanban/KanbanPageClient';
import StrategyTabs from '@/components/Strategy/StrategyTabs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ExecutionPage() {
    const cookieStore = await cookies();
    const tenantId = cookieStore.get('inner_event_tenant_id')?.value;

    if (!tenantId) {
        redirect('/login');
    }

    // Fetch Real Data
    const rawInitiatives = await getKanbanBoard(tenantId);

    const initiatives = rawInitiatives.map(i => ({
        id: i.id,
        title: i.title,
        status: i.status,
        horizon: i.horizon,
        progress: i.progress,
        description: i.description,
        team: i.team ? {
            members: i.team.members.map(m => ({
                user: {
                    name: m.user.name,
                    discProfile: m.user.discProfile ? { color: m.user.discProfile.color } : null
                }
            }))
        } : null
    }));

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <StrategyTabs />
            <KanbanPageClient initiatives={initiatives} />
        </div>
    );
}
