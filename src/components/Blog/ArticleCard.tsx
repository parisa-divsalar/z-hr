import styles from './BlogPage.module.css';
import { BlogArticle } from './data';

type ArticleCardProps = {
  article: BlogArticle;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className={styles.articleCard}>
      <div
        className={styles.articleImage}
        style={{ backgroundImage: `url(${article.image})` }}
        aria-hidden='true'
      />
      <div className={styles.articleDetails}>
        <div className={styles.articleMetaRow}>
          <span className={styles.articleCategory}>{article.category}</span>
          <span className={styles.articleMeta}>{article.meta}</span>
        </div>
        <h3 className={styles.articleTitle}>{article.title}</h3>
        <p className={styles.articleExcerpt}>{article.description}</p>
        <div className={styles.articleFooter}>
          <button type='button' className={styles.readMore}>
            Read More →
          </button>
        </div>
      </div>
    </article>
  );
}

