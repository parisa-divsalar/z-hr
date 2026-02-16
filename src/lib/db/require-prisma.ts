import { prisma } from '@/lib/db/prisma';

/**
 * Returns Prisma client only when DATABASE_URL is configured.
 * This avoids breaking local JSON-file dev setups.
 */
export function getPrismaOrNull() {
    const url = String(process.env.DATABASE_URL ?? '').trim();
    if (!url) return null;
    return prisma;
}

