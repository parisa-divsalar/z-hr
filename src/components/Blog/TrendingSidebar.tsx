import AddIcon from '@/assets/images/icons/add.svg';
import MuiButton from '@/components/UI/MuiButton';

import styles from './BlogPage.module.css';
import { TrendingTopic } from './data';

type TrendingSidebarProps = {
    topics: TrendingTopic[];
};

export default function TrendingSidebar({ topics }: TrendingSidebarProps) {
    return (
        <aside className={styles.trendingSidebar}>
            <div className={styles.trendingHeader}>
                <p className={styles.trendingTitle}>Trending in UAE / Dubai</p>
                <span className={styles.trendingBadge}>Resume Tips</span>
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
                Build a Dubai-ready CV
            </MuiButton>
        </aside>
    );
}

























