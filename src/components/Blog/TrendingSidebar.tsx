import AddIcon from '@/assets/images/icons/add.svg';
import MuiButton from '@/components/UI/MuiButton';

import styles from './BlogPage.module.css';

type TrendingTopicItem = { readonly title: string; readonly meta: string };

type TrendingSidebarProps = {
    trendingTitle: string;
    trendingBadge: string;
    buildCvLabel: string;
    topics: readonly TrendingTopicItem[];
};

export default function TrendingSidebar({
    trendingTitle,
    trendingBadge,
    buildCvLabel,
    topics,
}: TrendingSidebarProps) {
    return (
        <aside className={styles.trendingSidebar}>
            <div className={styles.trendingHeader}>
                <p className={styles.trendingTitle}>{trendingTitle}</p>
                <span className={styles.trendingBadge}>{trendingBadge}</span>
            </div>
            <ul className={styles.trendingList}>
                {topics.map((topic) => (
                    <li key={topic.title} className={styles.trendingItem}>
                        <span className={styles.trendingItemTitle}>{topic.title}</span>
                        <span className={styles.trendingItemMeta}>{topic.meta}</span>
                    </li>
                ))}
            </ul>
            <MuiButton size='large' startIcon={<AddIcon />} fullWidth>
                {buildCvLabel}
            </MuiButton>
        </aside>
    );
}

































