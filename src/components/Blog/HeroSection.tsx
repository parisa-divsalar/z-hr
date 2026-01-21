import styles from './BlogPage.module.css';
import { heroHighlights } from './data';

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <p className={styles.heroBreadcrumb}>Home &nbsp; / &nbsp; Blog</p>
      <h1 className={styles.heroTitle}>Zenonwork Learning Hub</h1>
      <p className={styles.heroSubtitle}>
        Dubai-ready CV, ATS tips, interview prep and career insights from the Z-CV team. Everything is
        crafted to help you shine in the GCC market.
      </p>
      <div className={styles.heroHighlights}>
        {heroHighlights.map((card) => (
          <article key={card.title} className={styles.heroCard}>
            <div className={styles.heroCardAccent} style={{ background: card.accent }}>
              {card.icon}
            </div>
            <h3 className={styles.heroCardTitle}>{card.title}</h3>
            <p className={styles.heroCardDesc}>{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

