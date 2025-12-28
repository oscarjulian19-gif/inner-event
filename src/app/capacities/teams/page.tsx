import { prisma } from '@/lib/prisma';
import TeamsClient from './TeamsClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
    const cookieStore = await cookies();
    const tenantId = cookieStore.get('inner_event_tenant_id')?.value;

    if (!tenantId) {
        redirect('/login');
    }

    const users = await prisma.user.findMany({
        where: { tenantId },
        include: { discProfile: true }
    });

    const teams = await prisma.team.findMany({
        where: { tenantId },
        include: { members: { include: { user: { include: { discProfile: true } } } } }
    });

    return <TeamsClient users={users} teams={teams} />;
}
