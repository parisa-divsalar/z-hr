import Link from 'next/link';

import { BlogArticle } from '@shared/blog/repository';

import styles from './BlogPage.module.css';

type ArticleCardProps = {
    article: BlogArticle;
    index: number;
};

export default function ArticleCard({ article, index }: ArticleCardProps) {
    return (
        <Link href={`/blog/details?index=${index}`} className={styles.articleCardLink}>
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
                    <p className={styles.articleExcerpt}>{article.shortTitle || article.description}</p>
                    <div className={styles.articleFooter}>
                        <span className={styles.readMore}>Read More →</span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
