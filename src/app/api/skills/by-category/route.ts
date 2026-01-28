import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');

        if (!category) {
            return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }

        // دریافت skills از database محلی بر اساس category
        const categorySkills = db.skills.findByCategory(category);
        const skillNames = categorySkills.map((s: any) => s.name);

        // اگر skill پیدا نشد، لیست خالی برمی‌گردانیم
        return NextResponse.json({
            data: skillNames,
        });
    } catch (error: any) {
        console.error('Error getting skills by category:', error);
        return NextResponse.json({ error: 'Failed to get skills' }, { status: 500 });
    }
}
