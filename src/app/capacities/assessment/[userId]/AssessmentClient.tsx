'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from '@/app/strategy/page.module.css';
import { DISC_QUESTIONS, Question } from '@/lib/disc/questions';
import { saveDiscResult } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function AssessmentClient({ userId }: { userId: string }) {
    const { dict, locale } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, 'D' | 'I' | 'S' | 'C'>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleOptionSelect = (qId: number, value: 'D' | 'I' | 'S' | 'C') => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const handleNext = () => {
        if (currentStep < DISC_QUESTIONS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            finishAssessment();
        }
    };

    const finishAssessment = async () => {
        setIsSubmitting(true);
        // Calc scores
        const tallies = { D: 0, I: 0, S: 0, C: 0 };
        Object.values(answers).forEach(val => tallies[val]++);

        // Determine max
        let maxColor: 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' = 'RED';
        let maxScore = -1;

        const map: Record<string, 'RED' | 'YELLOW' | 'GREEN' | 'BLUE'> = { D: 'RED', I: 'YELLOW', S: 'GREEN', C: 'BLUE' };

        (Object.keys(tallies) as Array<'D' | 'I' | 'S' | 'C'>).forEach(key => {
            if (tallies[key] > maxScore) {
                maxScore = tallies[key];
                maxColor = map[key];
            }
        });

        await saveDiscResult(userId, maxColor, tallies);
        router.push('/capacities/users');
    };

    const question = DISC_QUESTIONS[currentStep];
    const qText = locale === 'es' ? question.textEs : locale === 'zh' ? question.textZh : question.textEn;

    return (
        <div className={styles.container} style={{
            maxWidth: '100%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1), transparent 70%), url("https://grainy-gradients.vercel.app/noise.svg")',
            backgroundSize: 'cover',
            position: 'relative'
        }}>
            <div className="glass-panel" style={{
                padding: '3rem',
                maxWidth: '800px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
                backdropFilter: 'blur(20px)',
                background: 'hsl(var(--bg-glass))',
                border: '1px solid hsl(var(--border-glass))'
            }}>
                <h1 className={styles.header}>{dict.capacities.assessment.title}</h1>
                <p style={{ color: 'hsl(var(--text-muted))', marginBottom: '2rem' }}>
                    {dict.capacities.assessment.instruction} ({currentStep + 1}/{DISC_QUESTIONS.length})
                </p>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{qText}</h2>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {question.options.map((opt, idx) => {
                        const label = locale === 'es' ? opt.labelEs : locale === 'zh' ? opt.labelZh : opt.labelEn;
                        const isSelected = answers[question.id] === opt.value;

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(question.id, opt.value)}
                                className="glass-panel"
                                style={{
                                    padding: '1.5rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    border: isSelected ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border-glass))',
                                    background: isSelected ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                                    transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}
                            >
                                {label}
                                {isSelected && <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'hsl(var(--primary))' }} />}
                            </button>
                        );
                    })}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                    {currentStep === DISC_QUESTIONS.length - 1 && (
                        <span style={{ fontSize: '0.8rem', opacity: 0.7, fontStyle: 'italic' }}>
                            {dict.capacities.assessment.vignette}
                        </span>
                    )}
                    <button
                        className="btn-primary"
                        disabled={!answers[question.id] || isSubmitting}
                        onClick={handleNext}
                    >
                        {currentStep < DISC_QUESTIONS.length - 1 ? dict.capacities.assessment.next : dict.capacities.assessment.finish}
                    </button>
                </div>
            </div>
        </div>
    );
}
