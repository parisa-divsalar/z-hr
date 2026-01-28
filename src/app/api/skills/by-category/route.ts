import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');

        // اگر category ارسال نشده باشد، همه skills را از database برمی‌گردانیم
        const skills = category ? db.skills.findByCategory(category) : db.skills.findAll();
        const skillNames = skills.map((s: any) => s.name);

        return NextResponse.json({
            data: skillNames,
        });
    } catch (error: any) {
        console.error('Error getting skills by category:', error);
        return NextResponse.json({ error: 'Failed to get skills' }, { status: 500 });
    }
}
