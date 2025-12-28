export type Question = {
    id: number;
    textEn: string;
    textEs: string;
    textZh: string;
    options: {
        labelEn: string;
        labelEs: string;
        labelZh: string;
        value: 'D' | 'I' | 'S' | 'C';
    }[];
};

export const DISC_QUESTIONS: Question[] = [
    {
        id: 1,
        textEn: "How do you approach a new project?",
        textEs: "¿Cómo abordas un nuevo proyecto?",
        textZh: "您如何着手一个新项目？",
        options: [
            { labelEn: "Dive in and figure it out", labelEs: "Me lanzo y lo resuelvo", labelZh: "一头扎进去解决问题", value: 'D' },
            { labelEn: "Brainstorm with the team", labelEs: "Hago lluvia de ideas con el equipo", labelZh: "与团队集思广益", value: 'I' },
            { labelEn: "Plan every detail first", labelEs: "Planifico cada detalle primero", labelZh: "先计划好每一个细节", value: 'C' },
            { labelEn: "Make sure everyone is comfortable", labelEs: "Me aseguro que todos estén cómodos", labelZh: "确保每个人都感到舒适", value: 'S' },
        ]
    },
    {
        id: 2,
        textEn: "What motivates you most?",
        textEs: "¿Qué te motiva más?",
        textZh: "什么最能激励你？",
        options: [
            { labelEn: "Winning and results", labelEs: "Ganar y obtener resultados", labelZh: "获胜和结果", value: 'D' },
            { labelEn: "Recognition and fun", labelEs: "Reconocimiento y diversión", labelZh: "认可和乐趣", value: 'I' },
            { labelEn: "Accuracy and logic", labelEs: "Precisión y lógica", labelZh: "准确性和逻辑", value: 'C' },
            { labelEn: "Security and harmony", labelEs: "Seguridad y armonía", labelZh: "安全与和谐", value: 'S' },
        ]
    },
    {
        id: 3,
        textEn: "Under pressure, you tend to:",
        textEs: "Bajo presión, tiendes a:",
        textZh: "在压力下，你倾向于：",
        options: [
            { labelEn: "Take control", labelEs: "Tomar el control", labelZh: "掌控局面", value: 'D' },
            { labelEn: "Talk it out", labelEs: "Hablarlo", labelZh: "说出来", value: 'I' },
            { labelEn: "Analyze the data", labelEs: "Analizar los datos", labelZh: "分析数据", value: 'C' },
            { labelEn: "Seek support", labelEs: "Buscar apoyo", labelZh: "寻求支持", value: 'S' },
        ]
    },
    {
        id: 4,
        textEn: "You prefer a workspace that is:",
        textEs: "Prefieres un espacio de trabajo que sea:",
        textZh: "你更喜欢这样的工作空间：",
        options: [
            { labelEn: "Efficient and fast-paced", labelEs: "Eficiente y acelerado", labelZh: "高效且节奏快", value: 'D' },
            { labelEn: "Social and lively", labelEs: "Social y animado", labelZh: "社交且充满活力", value: 'I' },
            { labelEn: "Organized and quiet", labelEs: "Organizado y tranquilo", labelZh: "有条理且安静", value: 'C' },
            { labelEn: "Friendly and stable", labelEs: "Amigable y estable", labelZh: "友好且稳定", value: 'S' },
        ]
    }
];
