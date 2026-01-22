import ArticleCard from './ArticleCard';
import styles from './BlogPage.module.css';
import { BlogArticle } from '@shared/blog/repository';

type ArticleGridProps = {
    articles: BlogArticle[];
};

export default function ArticleGrid({ articles }: ArticleGridProps) {
    return (
        <section className={styles.articlesSection}>
            <div className={styles.articleGrid}>
                {articles.map((article, index) => (
                    <ArticleCard
                        article={article}
                        index={index}
                        key={`${article.title}-${article.category}`}
                    />
                ))}
            </div>
        </section>
    );
}
