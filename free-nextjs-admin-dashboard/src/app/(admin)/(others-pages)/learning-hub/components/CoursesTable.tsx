'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

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

interface CoursesTableProps {
  courses?: Course[];
  pageSize?: number;
  viewHref?: (course: Course) => string;
  editHref?: (course: Course) => string;
  onView?: (course: Course) => void;
  onEdit?: (course: Course) => void;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2
});

const formatLabel = (value: string) =>
  value
    .split(/[-_]/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

const formatPrice = (price: number) => {
  if (price === 0) {
    return 'Free';
  }

  return currencyFormatter.format(price);
};

const getLevelColor = (level: string) => {
  if (level === 'beginner') {
    return 'success';
  }

  if (level === 'intermediate') {
    return 'info';
  }

  return 'error';
};

export default function CoursesTable({
  courses = [],
  pageSize = 10,
  viewHref,
  editHref,
  onView,
  onEdit
}: CoursesTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(courses.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  const pageCourses = useMemo(
    () => courses.slice(startIndex, startIndex + pageSize),
    [courses, startIndex, pageSize]
  );

  const handlePrevious = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageCourses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No courses available.
              </TableCell>
            </TableRow>
          ) : (
            pageCourses.map((course) => {
              const viewLink = viewHref?.(course);
              const editLink = editHref?.(course);

              return (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>
                    <Badge variant="light" color="dark">
                      {formatLabel(course.platform)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatLabel(course.category)}</TableCell>
                  <TableCell>
                    <Badge variant="light" color={getLevelColor(course.level)}>
                      {formatLabel(course.level)}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.duration} hrs</TableCell>
                  <TableCell>{course.rating.toFixed(1)}</TableCell>
                  <TableCell>{formatPrice(course.price)}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {viewLink ? (
                        <Link
                          href={viewLink}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          View
                        </Link>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onView?.(course)}
                          disabled={!onView}
                        >
                          View
                        </Button>
                      )}
                      {editLink ? (
                        <Link
                          href={editLink}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                        >
                          Edit
                        </Link>
                      ) : (
                        <Button size="sm" onClick={() => onEdit?.(course)} disabled={!onEdit}>
                          Edit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          Showing {pageCourses.length} of {courses.length} courses
        </span>
        <div className="flex items-center gap-3">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
