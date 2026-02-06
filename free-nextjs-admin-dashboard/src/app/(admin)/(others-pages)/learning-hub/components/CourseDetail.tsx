'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Course = {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  level?: string;
  language?: string;
  price?: number;
  rating?: number;
  students?: number;
  lessons?: number;
  duration?: string;
  instructor?: string;
  status?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  source?: string;
  sourceUrl?: string;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

type CourseDetailProps = {
  courseId: string;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onTogglePublish?: (course: Course) => void;
};

const formatValue = (value?: string | number | boolean | null) => {
  if (value === undefined || value === null || value === '') {
    return '—';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return String(value);
};

const formatDate = (value?: string) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

export default function CourseDetail({
  courseId,
  onEdit,
  onDelete,
  onTogglePublish,
}: CourseDetailProps) {
  const apiBase = process.env.NEXT_PUBLIC_ZHR_API_URL || 'http://localhost:3000';
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(
    async (signal?: AbortSignal) => {
      if (!courseId) {
        setError('Course id is required.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiBase}/api/learning-hub/courses/${courseId}`, {
          signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load course (status ${response.status}).`);
        }

        const payload = (await response.json()) as {
          data?: Course;
          course?: Course;
        } | Course;
        const resolvedCourse =
          'data' in payload
            ? payload.data
            : 'course' in payload
              ? payload.course
              : payload;

        if (!resolvedCourse || !resolvedCourse.id) {
          throw new Error('Course not found.');
        }

        setCourse(resolvedCourse);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Unable to load course.');
        setCourse(null);
      } finally {
        setIsLoading(false);
      }
    },
    [courseId],
  );

  useEffect(() => {
    const controller = new AbortController();
    void fetchCourse(controller.signal);
    return () => controller.abort();
  }, [fetchCourse]);

  const details = useMemo(
    () =>
      course
        ? [
            { label: 'Title', value: formatValue(course.title) },
            { label: 'Description', value: formatValue(course.description) },
            { label: 'Category', value: formatValue(course.category) },
            { label: 'Level', value: formatValue(course.level) },
            { label: 'Language', value: formatValue(course.language) },
            { label: 'Price', value: formatValue(course.price) },
            { label: 'Rating', value: formatValue(course.rating) },
            { label: 'Students', value: formatValue(course.students) },
            { label: 'Lessons', value: formatValue(course.lessons) },
            { label: 'Duration', value: formatValue(course.duration) },
            { label: 'Instructor', value: formatValue(course.instructor) },
            { label: 'Status', value: formatValue(course.status) },
            { label: 'Published', value: formatValue(course.isPublished) },
            { label: 'Featured', value: formatValue(course.isFeatured) },
            { label: 'Source', value: formatValue(course.source) },
            { label: 'Source URL', value: formatValue(course.sourceUrl) },
            { label: 'Thumbnail', value: formatValue(course.thumbnailUrl) },
            { label: 'Created', value: formatDate(course.createdAt) },
            { label: 'Updated', value: formatDate(course.updatedAt) },
          ]
        : [],
    [course],
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Course Detail</p>
          <h2 className="text-xl font-semibold text-gray-900">
            {course?.title ?? courseId}
          </h2>
          {course?.category && (
            <p className="text-sm text-gray-500">{course.category}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (course) {
                onEdit?.(course);
              }
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!course || !onEdit}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              if (course) {
                onTogglePublish?.(course);
              }
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!course || !onTogglePublish}
          >
            {course?.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (course) {
                onDelete?.(course);
              }
            }}
            className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!course || !onDelete}
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => fetchCourse()}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
          >
            Refresh
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-6 rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
          Loading course details...
        </div>
      )}

      {error && !isLoading && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && course && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.label} className="rounded-md border border-gray-100 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {detail.label}
              </p>
              <p className="mt-1 text-sm text-gray-800">{detail.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
