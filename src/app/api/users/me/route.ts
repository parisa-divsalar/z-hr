import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function getUserIdFromAuth(request: NextRequest): Promise<number | null> {
    try {
        const cookieStore = await cookies();
        const cookieToken = cookieStore.get('accessToken')?.value;
        const header = request.headers.get('authorization');
        const headerToken = header?.startsWith('Bearer ') ? header.slice(7) : null;
        const token = cookieToken || headerToken;
        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const parsedId = Number(decoded?.userId);
        return Number.isFinite(parsedId) ? parsedId : null;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const userId = await getUserIdFromAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = db.users.findById(userId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
        data: {
            id: user.id,
            email: user.email,
            name: user.name,
            coin: user.coin ?? 0,
        },
    });
}






