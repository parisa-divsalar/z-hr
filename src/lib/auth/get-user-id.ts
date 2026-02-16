import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

function getJwtSecret(): string | null {
    // Keep a dev fallback secret to match `/api/auth/login` and other legacy endpoints.
    // Production should always set JWT_SECRET explicitly.
    const secret =
        String(process.env.JWT_SECRET ?? '').trim() ||
        'your-secret-key-change-in-production';

    return secret.trim() ? secret : null;
}

/**
 * Extracts and verifies userId from either:
 * - Cookie `accessToken`
 * - Authorization header `Bearer <token>`
 *
 * Returns null when missing/invalid.
 */
export async function getUserIdFromAuth(request: NextRequest): Promise<number | null> {
    try {
        const secret = getJwtSecret();
        if (!secret) return null;

        // Prefer request cookies (route handler context), fall back to next/headers cookies()
        const cookieToken =
            request.cookies.get('accessToken')?.value ?? (await cookies()).get('accessToken')?.value;
        const header = request.headers.get('authorization');
        const headerToken = header?.startsWith('Bearer ') ? header.slice(7) : null;
        const token = cookieToken || headerToken;
        if (!token) return null;

        const decoded = jwt.verify(token, secret) as any;
        const parsedId = Number(decoded?.userId);
        return Number.isFinite(parsedId) ? parsedId : null;
    } catch {
        return null;
    }
}

