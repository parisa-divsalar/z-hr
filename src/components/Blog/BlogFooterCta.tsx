import styles from './BlogPage.module.css';

export default function BlogFooterCta() {
  return (
    <section className={styles.ctaBanner}>
      <div>
        <p className={styles.ctaTitle}>Build a Dubai-ready CV</p>
        <p className={styles.ctaDesc}>
          Ready to turn the inspiration into an updated CV? Export in PDF/DOCX format and send it to
          recruiters with confidence.
        </p>
      </div>
      <button type='button' className={styles.ctaButton}>
        Get Started
      </button>
    </section>
  );
}

