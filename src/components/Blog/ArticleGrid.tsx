import ArticleCard from './ArticleCard';
import styles from './BlogPage.module.css';
import { BlogArticle } from './data';

type ArticleGridProps = {
    articles: BlogArticle[];
};

export default function ArticleGrid({ articles }: ArticleGridProps) {
    return (
        <section className={styles.articlesSection}>
            <div className={styles.articleGrid}>
                {articles.map((article) => (
                    <ArticleCard article={article} key={`${article.title}-${article.category}`} />
                ))}
            </div>
        </section>
    );
}
