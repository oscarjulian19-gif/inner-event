export type Locale = 'en' | 'es' | 'zh';

export const dictionaries = {
    en: {
        appTitle: 'PRAGMA: Your Strategic Partner',
        nav: {
            kanban: 'Key Initiatives',
            strategy: 'Manage Strategy',
            capacities: 'Capacities & Teams',
            analytics: 'Tu amigo PRAGMA',
            reports: 'Reports',
            emergent: 'Emergent Strategy'
        },
        emergent: {
            title: 'Emergent Strategy',
            description: 'The "Brain" 🧠 of your strategy. Analyzing data to surface **Hard Choices** and **Break Points**.',
            sections: {
                kill: {
                    title: '💀 Zombie Projects (Hard Choice: KILL)',
                    description: 'Initiatives consuming resources with low probability of success.',
                    empty: 'No Zombie Projects detected. Good job!',
                    action: 'Kill It'
                },
                pivot: {
                    title: '⚠️ Resource Hog (Hard Choice: PIVOT)',
                    description: 'High effort, low impact areas. Strategy might be wrong.',
                    empty: 'Allocation looks efficient.',
                    action: 'Pivot Strategy'
                },
                doubleDown: {
                    title: '🚀 Breakout Sign (Hard Choice: DOUBLE DOWN)',
                    description: 'Unexpected success in future horizons. Accelerate investment.',
                    empty: 'No breakout signals yet.',
                    action: 'Invest More'
                }
            },
            reasons: {
                zombie: 'KR "{statement}" is significantly behind ({progress}%) despite {time}% time elapsed.',
                resourceHog: 'KR "{statement}" has {count} active initiatives but low impact.',
                breakout: 'Emerging Initiative (H2/H3) "{title}" is performing exceptionally well.'
            }
        },
        capacities: {
            title: 'Capacities Management',
            users: {
                title: 'User Management',
                add: 'Add User',
                name: 'Name',
                email: 'Email',
                role: 'Role',
                department: 'Department',
                disc: 'DISC Profile',
                create: 'Create User',
            },
            assessment: {
                title: 'DISC Assessment',
                instruction: 'Answer honestly to discover your behavioral profile.',
                question: 'Question',
                next: 'Next',
                finish: 'Finish Assessment',
                result: 'Your DISC Profile is:',
                vignette: 'Color represents your dominant trait.'
            },
            teams: {
                title: 'Team Formation',
                pool: 'User Pool',
                proposed: 'Proposed Team',
                balance: 'Team Balance',
                suggestion: 'AI Suggestion',
            },
        },
        kanban: {
            todo: 'To Do',
            doing: 'In Progress',
            done: 'Done',
            column: 'Column',
        },
        strategy: {
            tabs: {
                planning: 'Manage OKRs',
                execution: 'Manage Key Initiatives'
            },
            title: 'Strategic Management',
            purpose: {
                title: '1. Polar Star 🌟 (Purpose)',
                placeholder: "Enter your Organization's Purpose...",
                button: 'Set Polar Star',
            },
            megas: {
                title: '2. Grand Destination 🏁 (Megas)',
                placeholder: 'New Grand Destination...',
                due: 'Due:',
            },
            objectives: {
                title: 'Objectives',
                placeholder: 'New Objective...',
            },
            krs: {
                placeholder: 'New KR...',
                target: 'Target',
                unit: 'Unit',
            },
        },
    },
    es: {
        appTitle: 'PRAGMA: Tu Partner Estratégico',
        nav: {
            kanban: 'Iniciativas Claves',
            strategy: 'Gestionar Estrategia',
            capacities: 'Capacidades y Equipos',
            analytics: 'Tu amigo PRAGMA',
            reports: 'Reportes',
            emergent: 'Estrategia Emergente'
        },
        emergent: {
            title: 'Estrategia Emergente',
            description: 'El "Cerebro" 🧠 de tu estrategia. Analizando datos para revelar **Elecciones Difíciles** y **Quiebres**.',
            sections: {
                kill: {
                    title: '💀 Proyectos Zombi (Elección: RENUNCIAR)',
                    description: 'Iniciativas que consumen recursos con baja probabilidad de éxito.',
                    empty: 'No se detectaron Proyectos Zombi. ¡Buen trabajo!',
                    action: 'Renunciar (Kill)'
                },
                pivot: {
                    title: '⚠️ Desperdicio de Recursos (Elección: PIVOTAR)',
                    description: 'Áreas de alto esfuerzo y bajo impacto. La estrategia podría estar errada.',
                    empty: 'La asignación parece eficiente.',
                    action: 'Pivotar Estrategia'
                },
                doubleDown: {
                    title: '🚀 Señal de Ruptura (Elección: DOBLAR APUESTA)',
                    description: 'Éxito inesperado en horizontes futuros. Acelerar inversión.',
                    empty: 'Sin señales de ruptura aún.',
                    action: 'Invertir Más'
                }
            },
            reasons: {
                zombie: 'KR "{statement}" está muy atrasado ({progress}%) a pesar de que pasó el {time}% del tiempo.',
                resourceHog: 'KR "{statement}" tiene {count} iniciativas activas pero bajo impacto.',
                breakout: 'Iniciativa Emergente (H2/H3) "{title}" está teniendo un desempeño excepcional.'
            }
        },
        capacities: {
            title: 'Gestión de Capacidades',
            users: {
                title: 'Gestión de Usuarios',
                add: 'Agregar Usuario',
                name: 'Nombre',
                email: 'Email',
                role: 'Cargo',
                department: 'Área',
                disc: 'Perfil DISC',
                create: 'Crear Usuario',
            },
            assessment: {
                title: 'Evaluación DISC',
                instruction: 'Responde honestamente para descubrir tu perfil conductual.',
                question: 'Pregunta',
                next: 'Siguiente',
                finish: 'Finalizar Evaluación',
                result: 'Tu Perfil DISC es:',
                vignette: 'El color representa tu rasgo dominante.'
            },
            teams: {
                title: 'Formación de Equipos',
                pool: 'Pool de Usuarios',
                proposed: 'Equipo Propuesto',
                balance: 'Balance del Equipo',
                suggestion: 'Sugerencia IA',
            },
        },
        kanban: {
            todo: 'Sin Iniciar',
            doing: 'En Curso',
            done: 'Completado',
            column: 'Columna',
        },
        strategy: {
            tabs: {
                planning: 'Gestión OKRs',
                execution: 'Gestión Iniciativas Claves'
            },
            title: 'Gestión Estratégica',
            purpose: {
                title: '1. Estrella Polar 🌟 (Propósito)',
                placeholder: 'Ingresa el Propósito de tu Organización...',
                button: 'Fijar Estrella Polar',
            },
            megas: {
                title: '2. Gran Destino 🏁 (Megas)',
                placeholder: 'Nuevo Gran Destino...',
                due: 'Vence:',
            },
            objectives: {
                title: 'Objetivos',
                placeholder: 'Nuevo Objetivo...',
            },
            krs: {
                placeholder: 'Nuevo KR...',
                target: 'Meta',
                unit: 'Unidad',
            },
        },
    },
    zh: {
        appTitle: '战略管理 SaaS',
        nav: {
            kanban: '关键举措',
            strategy: '管理战略',
            capacities: '能力与团队',
            analytics: 'Tu amigo PRAGMA',
            reports: '报告',
            emergent: '涌现战略'
        },
        emergent: {
            title: '涌现战略',
            description: '战略的“大脑” 🧠。分析数据以揭示 **艰难抉择 (Hard Choices)** 和 **断点 (Break Points)**。',
            sections: {
                kill: {
                    title: '💀 僵尸项目 (抉择：终止)',
                    description: '消耗资源但成功率极低的举措。',
                    empty: '未检测到僵尸项目。干得好！',
                    action: '终止 (Kill)'
                },
                pivot: {
                    title: '⚠️ 资源黑洞 (抉择：转型)',
                    description: '高投入、低影响的领域。战略可能有误。',
                    empty: '资源分配看起来很高效。',
                    action: '战略转型'
                },
                doubleDown: {
                    title: '🚀 突破信号 (抉择：加注)',
                    description: '未来地平线中的意外成功。加速投资。',
                    empty: '暂无突破信号。',
                    action: '追加投资'
                }
            },
            reasons: {
                zombie: '尽管时间已过 {time}%，KR "{statement}" 仍严重滞后 ({progress}%)。',
                resourceHog: 'KR "{statement}" 有 {count} 个活跃举措，但影响甚微。',
                breakout: '涌现举措 (H2/H3) "{title}" 表现异常出色。'
            }
        },
        capacities: {
            title: '能力管理',
            users: {
                title: '用户管理',
                add: '添加用户',
                name: '姓名',
                email: '邮箱',
                role: '角色',
                department: '部门',
                disc: 'DISC 档案',
                create: '创建用户',
            },
            assessment: {
                title: 'DISC 评估',
                instruction: '诚实回答以发现您的行为档案。',
                question: '问题',
                next: '下一步',
                finish: '完成评估',
                result: '您的 DISC 档案是：',
                vignette: '颜色代表您的主导特质。'
            },
            teams: {
                title: '团队组建',
                pool: '用户池',
                proposed: '建议团队',
                balance: '团队平衡',
                suggestion: 'AI 建议',
            },
        },
        kanban: {
            todo: '待办',
            doing: '进行中',
            done: '已完成',
            column: '列',
        },
        strategy: {
            tabs: {
                planning: '管理 OKRs',
                execution: '管理关键举措'
            },
            title: '战略管理',
            purpose: {
                title: '1. 北极星 (宗旨)',
                placeholder: '请输入您的组织宗旨...',
                button: '设定宗旨',
            },
            megas: {
                title: '2. 宏伟目标 (Megas)',
                placeholder: '新宏伟目标...',
                due: '截止:',
            },
            objectives: {
                title: '目标',
                placeholder: '新目标...',
            },
            krs: {
                placeholder: '新关键结果...',
                target: '目标值',
                unit: '单位',
            },
        },
    },
};
