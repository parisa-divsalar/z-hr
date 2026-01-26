'use client';

import { useEffect, useMemo, useState } from 'react';

import { BlogArticle } from '@shared/blog/repository';

import ArticleGrid from '@/components/Blog/ArticleGrid';
import BlogFilters from '@/components/Blog/BlogFilters';
import styles from '@/components/Blog/BlogPage.module.css';
import { trendingTopics } from '@/components/Blog/data';
import FeaturedStories from '@/components/Blog/FeaturedStories';
import HeroSection from '@/components/Blog/HeroSection';
import TrendingSidebar from '@/components/Blog/TrendingSidebar';

export default function BlogPage() {
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
                    throw new Error('Unable to load blog posts at the moment.');
                }
                const data = (await response.json()) as BlogArticle[];
                if (!cancelled) {
                    setArticles(data);
                    setErrorMessage(null);
                }
            } catch (error) {
                if (!cancelled) {
                    setErrorMessage((error as Error).message);
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
        return ['All', ...uniqueCategories];
    }, [articles]);

    useEffect(() => {
        if (!categories.includes(selectedCategory)) {
            setSelectedCategory('All');
        }
    }, [categories, selectedCategory]);

    const filteredArticles = useMemo(() => {
        const searchTerm = searchValue.trim().toLowerCase();
        return articles.filter((article) => {
            const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
            const searchableText = `${article.title} ${article.description}`.toLowerCase();
            const matchesSearch = searchTerm ? searchableText.includes(searchTerm) : true;
            return matchesCategory && matchesSearch;
        });
    }, [articles, selectedCategory, searchValue]);

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
                {errorMessage && (
                    <div className={styles.errorMessage} role='alert'>
                        {errorMessage}
                    </div>
                )}
                <div className={styles.contentColumns}>
                    {isLoading ? (
                        <div className={styles.loaderMessage}>در حال بارگذاری مقالات...</div>
                    ) : (
                        <ArticleGrid articles={filteredArticles} />
                    )}
                    <TrendingSidebar topics={trendingTopics} />
                </div>
            </div>
        </div>
    );
}
