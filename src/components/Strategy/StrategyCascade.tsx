'use client';

import React from 'react';
import styles from './StrategyCascade.module.css';

export default function StrategyCascade({ purpose }) {
    if (!purpose || !purpose.megas[0]) return <div>No strategic data found.</div>;

    const mega = purpose.megas[0];
    const topObjectives = mega.objectives;

    // Calculate Global Stats
    let totalObjectives = 0;
    let totalKRs = 0;
    let totalInitiatives = 0;
    let totalProgress = 0;
    let countForProgress = 0;

    const traverse = (objs) => {
        objs.forEach(obj => {
            totalObjectives++;
            obj.keyResults.forEach(kr => {
                totalKRs++;
                kr.initiatives?.forEach(init => {
                    totalInitiatives++;
                    totalProgress += init.progress;
                    countForProgress++;
                });
            });
            if (obj.childObjectives) traverse(obj.childObjectives);
        });
    };
    traverse(topObjectives);

    const globalProgress = countForProgress > 0 ? Math.round(totalProgress / countForProgress) : 0;

    const ObjectiveNode = ({ obj, level }) => {
        const [isExpanded, setIsExpanded] = React.useState(false); // Default collapsed
        const hasChildren = obj.childObjectives && obj.childObjectives.length > 0;

        const handleToggle = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (hasChildren) setIsExpanded(!isExpanded);
        };

        return (
            <div className={styles.nodeWrapper}>
                <div
                    className={`${styles.node} ${styles['level' + level]}`}
                    onClick={handleToggle}
                    style={{ cursor: hasChildren ? 'pointer' : 'default' }}
                >
                    <div className={styles.header}>
                        <span className={styles.role}>
                            {level === 1 ? 'Corporativo' : level === 2 ? 'Área' : 'Equipo'}
                        </span>
                        {/* Toggle Button */}
                        {hasChildren && (
                            <button
                                className={styles.toggleBtn}
                                title={isExpanded ? "Collapse" : "Expand"}
                            >
                                {isExpanded ? '−' : '+'}
                            </button>
                        )}
                    </div>

                    <div className={styles.content}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h4>{obj.statement}</h4>
                            {obj.owner && <div className={styles.ownerAvatar} title={obj.owner.name}>{obj.owner.name.charAt(0)}</div>}
                        </div>

                        {/* KRs Preview */}
                        <div className={styles.krs}>
                            {obj.keyResults.map(kr => (
                                <div key={kr.id} className={styles.krDot} title={kr.statement}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Children Recursion */}
                {obj.childObjectives && obj.childObjectives.length > 0 && isExpanded && (
                    <div className={styles.children}>
                        {obj.childObjectives.map(child => (
                            <ObjectiveNode key={child.id} obj={child} level={level + 1} />
                        ))}
                    </div>
                )}
                {/* Collapsed Indicator */}
                {obj.childObjectives && obj.childObjectives.length > 0 && !isExpanded && (
                    <div className={styles.collapsedLine} />
                )}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.statsBar}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Cumplimiento General</span>
                    <span className={styles.statValue}>{globalProgress}%</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Objetivos Totales</span>
                    <span className={styles.statValue}>{totalObjectives}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total KRs</span>
                    <span className={styles.statValue}>{totalKRs}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Iniciativas Activas</span>
                    <span className={styles.statValue}>{totalInitiatives}</span>
                </div>
            </div>

            <h2 className={styles.title}>Árbol de Objetivos en Cascada</h2>
            <div className={styles.tree}>
                <div className={styles.tree}>
                    {topObjectives.map(obj => (
                        <ObjectiveNode key={obj.id} obj={obj} level={1} />
                    ))}
                </div>
            </div>
        </div>
    );
}
