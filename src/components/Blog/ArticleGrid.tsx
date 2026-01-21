import styles from './BlogPage.module.css';
import ArticleCard from './ArticleCard';
import { BlogArticle } from './data';

type ArticleGridProps = {
  articles: BlogArticle[];
};

export default function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <section className={styles.articlesSection}>
      <div className={styles.sectionHeadingWrap}>
        <div>
          <p className={styles.sectionSubtitle}>Zenonwork Learning Hub</p>
          <h2 className={styles.sectionTitle}>Latest reads & produced insights</h2>
        </div>
        <button type='button' className={styles.viewMoreButton}>
          View all resources
        </button>
      </div>
      <div className={styles.articleGrid}>
        {articles.map((article) => (
          <ArticleCard article={article} key={`${article.title}-${article.category}`} />
        ))}
      </div>
    </section>
  );
}

