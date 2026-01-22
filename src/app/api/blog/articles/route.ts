import { NextResponse } from 'next/server';

import { getBlogArticles } from '@shared/blog/repository';

export async function GET() {
  const articles = await getBlogArticles();
  return NextResponse.json(articles);
}

