import { NextRequest, NextResponse } from 'next/server';
import { ChatGPTService } from '@/services/chatgpt/service';

// Common skill categories - can be extended
const COMMON_CATEGORIES = [
    'Web Frameworks',
    'Programming Languages',
    'Web Development',
    'Mobile Development',
    'Database',
    'Cloud Computing',
    'DevOps',
    'Data Science',
    'Machine Learning',
    'Design',
    'Marketing',
    'Sales',
    'Management',
    'Finance',
    'Healthcare',
    'Education',
    'Engineering',
    'Other',
];

export async function GET(request: NextRequest) {
    try {
        // Return common categories
        // In the future, can use ChatGPT to generate dynamic categories
        return NextResponse.json({
            data: COMMON_CATEGORIES,
        });
    } catch (error: any) {
        console.error('Error getting skill categories:', error);
        return NextResponse.json({ error: 'Failed to get categories' }, { status: 500 });
    }
}
