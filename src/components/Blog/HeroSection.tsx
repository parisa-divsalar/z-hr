import { Typography } from '@mui/material';

import styles from './BlogPage.module.css';
import { heroHighlights } from './data';

export default function HeroSection() {
    return (
        <section className={styles.heroSection}>
            <p className={styles.heroBreadcrumb}>Home &nbsp; / &nbsp; Blog</p>
            <Typography variant='h1' fontWeight='700' color='text.primary' textAlign='center'>
                Zenonwork Learning Hub
            </Typography>

            <Typography variant='h3' fontWeight='400' color='text.primary' textAlign='center' py={5}>
                Dubai-ready CV, ATS tips,
            </Typography>
            <div className={styles.heroHighlights}>
                {heroHighlights.map((card) => (
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
