'use client';

import { useEffect, useMemo, useState } from 'react';

import { BlogArticle } from '@shared/blog/repository';

import ArticleGrid from '@/components/Blog/ArticleGrid';
import BlogFilters from '@/components/Blog/BlogFilters';
import styles from '@/components/Blog/BlogPage.module.css';
import FeaturedStories from '@/components/Blog/FeaturedStories';
import HeroSection from '@/components/Blog/HeroSection';
import TrendingSidebar from '@/components/Blog/TrendingSidebar';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

export default function BlogPage() {
    const locale = useLocaleStore((s) => s.locale);
    const dir = locale === 'fa' ? 'rtl' : 'ltr';
    const t = getMainTranslations(locale).blogPage;
    const [articles, setArticles] = useState<BlogArticle[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchArticles = async () => {
            try {
                const response = await fetch('/api/blog/articles');
                if (!response.ok) {
                    throw new Error('BLOG_LOAD_ERROR');
                }
                const data = (await response.json()) as BlogArticle[];
                if (!cancelled) {
                    setArticles(data);
                    setErrorMessage(null);
                }
            } catch {
                if (!cancelled) {
                    setErrorMessage('BLOG_LOAD_ERROR');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchArticles();

        return () => {
            cancelled = true;
        };
    }, []);

    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(articles.map((article) => article.category)));
        return [t.allCategories, ...uniqueCategories];
    }, [articles, t.allCategories]);

    useEffect(() => {
        if (!categories.includes(selectedCategory)) {
            setSelectedCategory(t.allCategories);
        }
    }, [categories, selectedCategory, t.allCategories]);

    const filteredArticles = useMemo(() => {
        const searchTerm = searchValue.trim().toLowerCase();
        return articles.filter((article) => {
            const matchesCategory =
                selectedCategory === t.allCategories || article.category === selectedCategory;
            const searchableText = `${article.title} ${article.description}`.toLowerCase();
            const matchesSearch = searchTerm ? searchableText.includes(searchTerm) : true;
            return matchesCategory && matchesSearch;
        });
    }, [articles, selectedCategory, searchValue, t.allCategories]);

    return (
        <div className={styles.pageShell} dir={dir} style={{ direction: dir }}>
            <div className={styles.pageContainer}>
                <HeroSection />
                <FeaturedStories />
                <BlogFilters
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    searchPlaceholder={t.searchPlaceholder}
                    categoryLabels={t.categoryLabels}
                    allCategoriesLabel={t.allCategories}
                />
                {errorMessage && (
                    <div className={styles.errorMessage} role='alert'>
                        {t.errorLoad}
                    </div>
                )}
                <div className={styles.contentColumns}>
                    {isLoading ? (
                        <div className={styles.loaderMessage}>{t.loadingArticles}</div>
                    ) : (
                        <ArticleGrid
                            articles={filteredArticles}
                            readMoreLabel={t.readMore}
                            categoryLabels={t.categoryLabels}
                            cardMetaLabels={t.cardMetaLabels}
                            cardTitleLabels={t.cardTitleLabels}
                        />
                    )}
                    <TrendingSidebar
                        trendingTitle={t.trendingTitle}
                        trendingBadge={t.trendingBadge}
                        buildCvLabel={t.buildCv}
                        topics={t.trendingTopics}
                    />
                </div>
            </div>
        </div>
    );
}
