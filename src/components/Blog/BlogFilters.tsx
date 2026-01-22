import styles from './BlogPage.module.css';

type BlogFiltersProps = {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
};

export default function BlogFilters({
    categories,
    selectedCategory,
    onCategoryChange,
    searchValue,
    onSearchChange,
}: BlogFiltersProps) {
    return (
        <section className={styles.filtersSection}>
            <div className={styles.filtersRow}>
                {categories.map((category) => (
                    <button
                        key={category}
                        type='button'
                        className={`${styles.filterPill} ${
                            selectedCategory === category ? styles.filterPillActive : ''
                        }`}
                        onClick={() => onCategoryChange(category)}
                    >
                        {category}
                    </button>
                ))}
                <input
                    className={styles.searchInput}
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder='Search topics, tips or keywords...'
                />
            </div>
        </section>
    );
}
