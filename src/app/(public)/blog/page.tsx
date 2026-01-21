'use client';

import { useMemo, useState } from 'react';

import ArticleGrid from '@/components/Blog/ArticleGrid';
import BlogFilters from '@/components/Blog/BlogFilters';
import BlogFooterCta from '@/components/Blog/BlogFooterCta';
import styles from '@/components/Blog/BlogPage.module.css';
import { blogArticles, categories, insightHighlights, trendingTopics } from '@/components/Blog/data';
import FeaturedStories from '@/components/Blog/FeaturedStories';
import HeroSection from '@/components/Blog/HeroSection';
import TrendingSidebar from '@/components/Blog/TrendingSidebar';

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [searchValue, setSearchValue] = useState('');

    const filteredArticles = useMemo(() => {
        const searchTerm = searchValue.trim().toLowerCase();
        return blogArticles.filter((article) => {
            const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
            const searchableText = `${article.title} ${article.description}`.toLowerCase();
            const matchesSearch = searchTerm ? searchableText.includes(searchTerm) : true;
            return matchesCategory && matchesSearch;
        });
    }, [searchValue, selectedCategory]);

    return (
        <div className={styles.pageShell}>
            <div className={styles.pageContainer}>
                <HeroSection />
                <FeaturedStories />
                <BlogFilters
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                />
                <div className={styles.contentColumns}>
                    <ArticleGrid articles={filteredArticles} />
                    <TrendingSidebar topics={trendingTopics} />
                </div>
                <section className={styles.moreSection}>
                    <div className={styles.moreHeader}>
                        <div>
                            <p className={styles.sectionSubtitle}>Resources</p>
                            <h2 className={styles.sectionTitle}>Bitesize reads to boost your career</h2>
                        </div>
                        <button type='button' className={styles.moreLink}>
                            Explore All
                        </button>
                    </div>
                    <div className={styles.moreGrid}>
                        {insightHighlights.map((insight) => (
                            <article className={styles.insightCard} key={insight.title}>
                                <div
                                    className={styles.insightImage}
                                    style={{ backgroundImage: `url(${insight.image})` }}
                                    aria-hidden='true'
                                />
                                <div className={styles.insightContent}>
                                    <p className={styles.insightTag}>{insight.tag}</p>
                                    <h3 className={styles.insightTitle}>{insight.title}</h3>
                                    <p className={styles.insightDescription}>{insight.description}</p>
                                    <p className={styles.insightMeta}>{insight.meta}</p>
                                    <button type='button' className={styles.insightLink}>
                                        Read More →
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
                <BlogFooterCta />
            </div>
        </div>
    );
}
