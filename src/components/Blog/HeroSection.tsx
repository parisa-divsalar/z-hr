import { Typography } from '@mui/material';

import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

import styles from './BlogPage.module.css';
import { heroHighlights } from './data';

const accents = [
    'linear-gradient(120deg, #4d49fc, #a466ff)',
    'linear-gradient(120deg, #ff7ebf, #ffb199)',
    'linear-gradient(120deg, #3dd4bd, #5ddeff)',
];
const icons = ['✦', '✧', '✔'];

export default function HeroSection() {
    const locale = useLocaleStore((s) => s.locale);
    const mainT = getMainTranslations(locale);
    const t = mainT.blogPage;
    const blogLabel = mainT.nav.blog;
    const highlights = t.heroHighlights.map((card, i) => ({
        ...card,
        accent: heroHighlights[i]?.accent ?? accents[i] ?? accents[0],
        icon: icons[i] ?? '✦',
    }));
    return (
        <section className={styles.heroSection}>
            <p className={styles.heroBreadcrumb}>
                {t.home}
                {t.breadcrumbSep}
                {blogLabel}
            </p>
            <Typography variant='h1' fontWeight='700' color='text.primary' textAlign='center'>
                {t.heroTitle}
            </Typography>

            <Typography variant='h3' fontWeight='400' color='text.primary' textAlign='center' py={5}>
                {t.heroSubtitle}
            </Typography>
            <div className={styles.heroHighlights}>
                {highlights.map((card) => (
                    <article key={card.title} className={styles.heroCard}>
                        <h3 className={styles.heroCardTitle}>{card.title}</h3>
                        <p className={styles.heroCardDesc}>{card.description}</p>
                        <div className={styles.heroCardAccent} style={{ background: card.accent }}>
                            {card.icon}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
