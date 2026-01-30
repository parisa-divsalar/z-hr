import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SKILLS_BY_CATEGORY } from '@/lib/skills-catalog';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');

        const MIN_CATEGORY_SKILLS = 20;

        let skills = category ? db.skills.findByCategory(category) : db.skills.findAll();

        if (category && skills.length < MIN_CATEGORY_SKILLS) {
            const seedList = SKILLS_BY_CATEGORY[category];
            if (Array.isArray(seedList) && seedList.length > 0) {
                db.skills.createMany(
                    seedList.map((name) => ({
                        name,
                        category,
                    })),
                );
                skills = db.skills.findByCategory(category);
            }
        }

        const skillNames = skills.map((s: any) => s.name);

        return NextResponse.json({
            data: skillNames,
        });
    } catch (error: any) {
        console.error('Error getting skills by category:', error);
        return NextResponse.json({ error: 'Failed to get skills' }, { status: 500 });
    }
}
