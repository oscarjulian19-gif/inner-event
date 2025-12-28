import { prisma } from '@/lib/prisma';
import RitualsListClient from './RitualsListClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function RitualsPage() {
    const cookieStore = await cookies();
    const tenantId = cookieStore.get('inner_event_tenant_id')?.value;

    if (!tenantId) {
        redirect('/login');
    }

    const rituals = await prisma.ritual.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        include: {
            participants: {
                include: { user: true }
            }
        }
    });

    return <RitualsListClient rituals={rituals} />;
}
