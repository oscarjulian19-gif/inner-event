type User = {
    id: string;
    name: string;
    email: string;
    discProfile?: {
        color: string;
    } | null;
};

export function suggestTeam(users: User[], size: number = 3) {
    // Ideally we want at least one of each color, or a mix.
    // Simple algorithm:
    // 1. Group users by color.
    // 2. Pick one from each available color until size is met.

    const pools: Record<string, User[]> = {
        RED: [],
        YELLOW: [],
        GREEN: [],
        BLUE: [],
        NONE: []
    };

    users.forEach(u => {
        const color = u.discProfile?.color || 'NONE';
        if (pools[color]) {
            pools[color].push(u);
        } else {
            pools['NONE'].push(u);
        }
    });

    const team: User[] = [];
    const colors = ['RED', 'YELLOW', 'GREEN', 'BLUE'];

    // Try to pick one unique color for each slot
    let colorIdx = 0;

    while (team.length < size && team.length < users.length) {
        const color = colors[colorIdx % 4];
        if (pools[color].length > 0) {
            team.push(pools[color].pop()!);
        } else {
            // Fallback to any other color
            let found = false;
            for (const c of colors) {
                if (pools[c].length > 0) {
                    team.push(pools[c].pop()!);
                    found = true;
                    break;
                }
            }
            if (!found && pools['NONE'].length > 0) {
                team.push(pools['NONE'].pop()!);
            }
        }
        colorIdx++;
    }

    return team;
}
