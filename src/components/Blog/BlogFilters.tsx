import styles from './BlogPage.module.css';

type BlogFiltersProps = {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    categoryLabels: Record<string, string>;
    allCategoriesLabel: string;
};

export default function BlogFilters({
    categories,
    selectedCategory,
    onCategoryChange,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    categoryLabels,
    allCategoriesLabel,
}: BlogFiltersProps) {
    const getCategoryDisplayLabel = (category: string) =>
        category === allCategoriesLabel ? allCategoriesLabel : (categoryLabels[category] ?? category);

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
                        {getCategoryDisplayLabel(category)}
                    </button>
                ))}
                <input
                    className={styles.searchInput}
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={searchPlaceholder}
                />
            </div>
        </section>
    );
}
