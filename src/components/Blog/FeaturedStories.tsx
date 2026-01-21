import styles from './BlogPage.module.css';
import { featuredStories } from './data';

export default function FeaturedStories() {
  return (
    <section className={styles.featuredSection}>
      <div className={styles.featuredGrid}>
        {featuredStories.map((story) => (
          <article
            key={story.title}
            className={styles.featuredCard}
            style={{
              backgroundImage: story.image ? `url(${story.image})` : undefined,
            }}
          >
            <div className={styles.featuredOverlay} />
            <div className={styles.featuredCardContent}>
              <span className={styles.featuredTag}>{story.tag}</span>
              <h3 className={styles.featuredTitle}>{story.title}</h3>
              <p className={styles.featuredMeta}>{story.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

