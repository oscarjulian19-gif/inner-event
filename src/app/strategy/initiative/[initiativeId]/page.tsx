import { prisma } from '@/lib/prisma';
import InitiativeClient from './InitiativeClient';
import { createKanbanTask } from '@/app/actions';

export default async function InitiativePage({ params }: { params: Promise<{ initiativeId: string }> }) {
    const { initiativeId } = await params;

    const initiative = await prisma.initiative.findUnique({
        where: { id: initiativeId },
        include: {
            owner: true,
            keyResult: true
        }
    });

    const tasks = await prisma.kanbanTask.findMany({
        where: { initiativeId },
        include: { assignee: true }
    });

    if (!initiative) return <div>Initiative not found</div>;

    // Transform tasks to match KanbanBoard expected type
    const formattedTasks = tasks.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        assignee: t.assignee
    }));

    return <InitiativeClient initiative={initiative} tasks={formattedTasks} createKanbanTaskAction={createKanbanTask} />;
}
