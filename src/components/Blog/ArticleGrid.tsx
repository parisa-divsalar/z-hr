import { BlogArticle } from '@shared/blog/repository';

import ArticleCard from './ArticleCard';
import styles from './BlogPage.module.css';

type ArticleGridProps = {
    articles: BlogArticle[];
    readMoreLabel: string;
    categoryLabels: Record<string, string>;
    cardMetaLabels?: Record<string, string>;
    cardTitleLabels?: Record<string, string>;
};

export default function ArticleGrid({
    articles,
    readMoreLabel,
    categoryLabels,
    cardMetaLabels = {},
    cardTitleLabels = {},
}: ArticleGridProps) {
    return (
        <section className={styles.articlesSection}>
            <div className={styles.articleGrid}>
                {articles.map((article, index) => (
                    <ArticleCard
                        article={article}
                        index={index}
                        key={`${article.title}-${article.category}`}
                        readMoreLabel={readMoreLabel}
                        categoryLabel={categoryLabels[article.category] ?? article.category}
                        metaLabels={cardMetaLabels}
                        titleLabels={cardTitleLabels}
                    />
                ))}
            </div>
        </section>
    );
}
