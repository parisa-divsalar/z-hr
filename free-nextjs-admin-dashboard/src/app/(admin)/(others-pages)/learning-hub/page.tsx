'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Analytics from './components/Analytics';
import CourseCards from './components/CourseCards';
import CourseFilters, { CourseFiltersState } from './components/CourseFilters';
import CoursesTable from './components/CoursesTable';
import SyncButton from './components/SyncButton';

interface Course {
  id: string;
  title: string;
  description: string;
  platform: string;
  category: string;
  level: string;
  duration: number;
  price: number;
  rating: number;
  instructor: string;
  url: string;
  tags: string[];
}

export default function LearningHubPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const searchParams = useSearchParams();

  const apiBase = process.env.NEXT_PUBLIC_ZHR_API_URL || 'http://localhost:3000';

  const filters = useMemo<CourseFiltersState>(() => {
    return {
      search: searchParams.get('search') ?? '',
      category: searchParams.get('category') ?? '',
      level: searchParams.get('level') ?? '',
      status: searchParams.get('status') ?? '',
      provider: searchParams.get('provider') ?? ''
    };
  }, [searchParams]);

  const totalCourses = courses.length;
  const averageRating = totalCourses > 0
    ? (courses.reduce((sum, course) => sum + course.rating, 0) / totalCourses).toFixed(1)
    : '0.0';
  const categoriesCount = new Set(courses.map((course) => course.category)).size;
  const platformsCount = new Set(courses.map((course) => course.platform)).size;

  const fetchCourses = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.category) params.set('category', filters.category);
      if (filters.level) params.set('level', filters.level);
      if (filters.provider) params.set('platform', filters.provider);

      const url = new URL('/api/learning-hub/courses', apiBase);
      url.search = params.toString();

      const response = await fetch(url.toString(), { signal });
      if (!response.ok) {
        throw new Error(`Failed to fetch courses (status ${response.status}).`);
      }

      const payload = await response.json();
      const data = payload?.data ?? payload?.courses ?? [];
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      setCourses([]);
      setError(err instanceof Error ? err.message : 'Failed to fetch courses.');
    } finally {
      setLoading(false);
    }
  }, [apiBase, filters.category, filters.level, filters.provider, filters.search]);

  const fetchCategories = useCallback(async (signal?: AbortSignal) => {
    try {
      const url = new URL('/api/learning-hub/categories', apiBase);
      const response = await fetch(url.toString(), { signal });
      if (!response.ok) {
        throw new Error(`Failed to fetch categories (status ${response.status}).`);
      }
      const payload = await response.json();
      const data = payload?.data ?? [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setCategories([]);
    }
  }, [apiBase]);

  useEffect(() => {
    const controller = new AbortController();
    void fetchCourses(controller.signal);
    void fetchCategories(controller.signal);
    return () => controller.abort();
  }, [fetchCourses, fetchCategories]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Learning Hub</h1>
          <p className="text-sm text-muted-foreground">
            Total Courses: {courses.length} · Categories: {categoriesCount} · Platforms: {platformsCount} · Avg Rating: {averageRating}
          </p>
        </div>
        <SyncButton />
      </header>

      <CourseFilters
        categories={categories}
        providers={['udemy', 'youtube', 'coursera', 'linkedin-learning', 'internal']}
      />

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Analytics />
        </TabsContent>

        <TabsContent value="cards">
          <CourseCards courses={courses} isLoading={loading} />
        </TabsContent>

        <TabsContent value="table">
          <CoursesTable courses={courses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
