import Link from 'next/link';

import { BlogArticle } from '@shared/blog/repository';

import styles from './BlogPage.module.css';

type ArticleCardProps = {
    article: BlogArticle;
    index: number;
    readMoreLabel: string;
    categoryLabel?: string;
    metaLabels?: Record<string, string>;
    titleLabels?: Record<string, string>;
};

function translateMeta(meta: string, metaLabels: Record<string, string>): string {
    if (!meta || Object.keys(metaLabels).length === 0) return meta;
    return meta
        .split(/\s*·\s*/)
        .map((part) => metaLabels[part.trim()] ?? part)
        .join(' · ');
}

export default function ArticleCard({
    article,
    index,
    readMoreLabel,
    categoryLabel,
    metaLabels = {},
    titleLabels = {},
}: ArticleCardProps) {
    const displayMeta = translateMeta(article.meta, metaLabels);
    const displayTitle = titleLabels[article.title] ?? article.title;
    const displayExcerpt =
        (article.shortTitle && (titleLabels[article.shortTitle] ?? article.shortTitle)) ||
        article.description;

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
                        <span className={styles.articleCategory}>{categoryLabel ?? article.category}</span>
                        <span className={styles.articleMeta}>{displayMeta}</span>
                    </div>
                    <h3 className={styles.articleTitle}>{displayTitle}</h3>
                    <p className={styles.articleExcerpt}>{displayExcerpt}</p>
                    <div className={styles.articleFooter}>
                        <span className={styles.readMore}>{readMoreLabel}</span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
