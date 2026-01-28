import { NextResponse } from "next/server";

import {
  appendBlogArticle,
  getBlogArticles,
  removeBlogArticle,
  replaceBlogArticles,
  type BlogArticle,
} from "@shared/blog/repository";

const toErrorResponse = (message: string, status = 400) =>
  NextResponse.json({ message }, { status });

const hasValue = (value: unknown) => typeof value === "string" && value.trim().length > 0;

const normalizeArticle = (payload: BlogArticle): BlogArticle => ({
  title: payload.title.trim(),
  shortTitle: payload.shortTitle?.trim() || undefined,
  description: payload.description.trim(),
  category: payload.category.trim(),
  meta: payload.meta.trim(),
  image: payload.image.trim(),
  banner: payload.banner?.trim() || undefined,
  keyTakeaways: payload.keyTakeaways?.filter(Boolean),
});

export async function GET() {
  const articles = await getBlogArticles();
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  let payload: BlogArticle;
  try {
    payload = (await request.json()) as BlogArticle;
  } catch {
    return toErrorResponse("Invalid JSON payload.");
  }

  if (
    !hasValue(payload?.title) ||
    !hasValue(payload?.description) ||
    !hasValue(payload?.category) ||
    !hasValue(payload?.meta) ||
    !hasValue(payload?.image)
  ) {
    return toErrorResponse("Please provide title, description, category, meta, and image.");
  }

  const updated = await appendBlogArticle(normalizeArticle(payload));
  return NextResponse.json(updated);
}

export async function PATCH(request: Request) {
  let payload: { index: number; article: BlogArticle };
  try {
    payload = (await request.json()) as { index: number; article: BlogArticle };
  } catch {
    return toErrorResponse("Invalid JSON payload.");
  }

  if (typeof payload?.index !== "number" || payload.index < 0) {
    return toErrorResponse("Invalid article index.");
  }

  const current = await getBlogArticles();
  if (payload.index >= current.length) {
    return toErrorResponse("Invalid article index.");
  }

  const updatedArticle = normalizeArticle(payload.article);
  const updated = current.map((item, idx) => (idx === payload.index ? updatedArticle : item));
  await replaceBlogArticles(updated);
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  let payload: { index: number };
  try {
    payload = (await request.json()) as { index: number };
  } catch {
    return toErrorResponse("Invalid JSON payload.");
  }

  if (typeof payload?.index !== "number") {
    return toErrorResponse("Invalid article index.");
  }

  try {
    const updated = await removeBlogArticle(payload.index);
    return NextResponse.json(updated);
  } catch (error) {
    return toErrorResponse((error as Error).message || "Unable to delete the article.");
  }
}






