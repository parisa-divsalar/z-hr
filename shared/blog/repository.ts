import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fsPromises = fs.promises;
const articlesFilePath = resolveArticlesFilePath();

export type BlogArticle = {
  title: string;
  shortTitle?: string;
  description: string;
  category: string;
  meta: string;
  image: string;
  banner?: string;
  keyTakeaways?: string[];
  /** Persian (Farsi) locale overrides – when present, shown when user selects فارسی */
  titleFa?: string;
  shortTitleFa?: string;
  descriptionFa?: string;
  metaFa?: string;
  keyTakeawaysFa?: string[];
};

async function readRepository(): Promise<BlogArticle[]> {
  try {
    const fileContent = await fsPromises.readFile(articlesFilePath, 'utf-8');
    return JSON.parse(fileContent) ?? [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await writeRepository([]);
      return [];
    }
    throw error;
  }
}

async function writeRepository(articles: BlogArticle[]): Promise<void> {
  await fsPromises.writeFile(articlesFilePath, JSON.stringify(articles, null, 2), 'utf-8');
}

export async function getBlogArticles(): Promise<BlogArticle[]> {
  return readRepository();
}

export async function replaceBlogArticles(articles: BlogArticle[]): Promise<BlogArticle[]> {
  await writeRepository(articles);
  return articles;
}

export async function appendBlogArticle(article: BlogArticle): Promise<BlogArticle[]> {
  const current = await readRepository();
  const updated = [...current, article];
  await writeRepository(updated);
  return updated;
}

export async function removeBlogArticle(index: number): Promise<BlogArticle[]> {
  const current = await readRepository();
  if (index < 0 || index >= current.length) {
    throw new Error('Invalid article index.');
  }
  const updated = current.filter((_, idx) => idx !== index);
  await writeRepository(updated);
  return updated;
}

function resolveArticlesFilePath(): string {
  const candidates = [
    path.resolve(process.cwd(), 'shared', 'blog', 'articles.json'),
    path.resolve(process.cwd(), '..', 'shared', 'blog', 'articles.json'),
    path.resolve(process.cwd(), '..', '..', 'shared', 'blog', 'articles.json'),
    path.join(__dirname, 'articles.json'),
  ];
  const autoResult = candidates.find((candidate) => fs.existsSync(candidate));
  return autoResult ?? candidates[candidates.length - 1];
}

