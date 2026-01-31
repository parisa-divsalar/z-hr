'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

import Blog from '@/app/main/Blog';
import CraftResume from '@/app/main/CraftResume';
import Faq from '@/app/main/Faq';
import FooterMain from '@/app/main/FooterMain';
import HeroSection from '@/app/main/HeroSection';
import KeyBenefits from '@/app/main/KeyBenefits';
import Pricing from '@/app/main/Pricing';
import ProductFeatures from '@/app/main/ProductFeatures';
import Testimonials from '@/app/main/Testimonials';

const easeOutBezier: [number, number, number, number] = [0.16, 1, 0.3, 1];

function HoverRevealSection({ children }: { children: ReactNode }) {
    const shouldReduceMotion = useReducedMotion();
    const [isActive, setIsActive] = useState(false);

    const activate = useCallback(() => setIsActive(true), []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mq = window.matchMedia?.('(hover: none), (pointer: coarse)');
        if (mq?.matches) setIsActive(true);
    }, []);

    const variants: Variants = useMemo(() => {
        if (shouldReduceMotion) {
            return {
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: 0.15 } },
            };
        }
        return {
            hidden: { opacity: 0, y: 10, filter: 'blur(10px)' },
            show: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.2, ease: easeOutBezier },
            },
        };
    }, [shouldReduceMotion]);

    return (
        <motion.div
            initial='hidden'
            animate={isActive ? 'show' : 'hidden'}
            variants={variants}
            onMouseEnter={activate}
            onFocusCapture={activate}
            style={{ width: '100%' }}
        >
            {children}
        </motion.div>
    );
}

export default function MinaComponent() {
    return (
        <div
            style={{
                minHeight: 'var(--app-height)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <main
                style={{
                    width: '100%',
                    flex: 1,
                    height: 'fit-content',
                    background: '#fcfbff',
                    overflowX: 'hidden',
                }}
            >
                <HeroSection />

                <HoverRevealSection>
                    <KeyBenefits />
                </HoverRevealSection>

                <HoverRevealSection>
                    <CraftResume />
                </HoverRevealSection>

                <HoverRevealSection>
                    <ProductFeatures />
                </HoverRevealSection>
                <HoverRevealSection>
                    <div id='pricing'>
                        <Pricing />
                    </div>
                </HoverRevealSection>
                <HoverRevealSection>
                    <Blog />
                </HoverRevealSection>
                <HoverRevealSection>
                    <div id='faq'>
                        <Faq />
                    </div>
                </HoverRevealSection>
                <HoverRevealSection>
                    <Testimonials />
                </HoverRevealSection>
            </main>

            <div id='contact'>
                <FooterMain />
            </div>
        </div>
    );
}
