import { prisma } from '@/lib/prisma';
import { createUser } from '@/app/actions';
import UsersClient from './UsersClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    const cookieStore = await cookies();
    const tenantId = cookieStore.get('inner_event_tenant_id')?.value;

    if (!tenantId) {
        redirect('/login');
    }

    const users = await prisma.user.findMany({
        where: { tenantId },
        include: {
            discProfile: true,
            ledTeams: { // If they are a leader, get their team
                include: {
                    leader: true,
                    members: { include: { user: true } }
                }
            },
            teams: { // If they are a member, get the team they are in
                include: {
                    team: {
                        include: {
                            leader: true,
                            members: { include: { user: true } }
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Cast users to any to bypass strict enum vs string type mismatch on jobRole
    return <UsersClient users={users as any} createUserAction={createUser} />;
}
