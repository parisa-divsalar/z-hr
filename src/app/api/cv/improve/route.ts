import { NextRequest, NextResponse } from 'next/server';
import { ChatGPTService } from '@/services/chatgpt/service';

export async function POST(request: NextRequest) {
    try {
        const { section, context, isFinalStep, resume, mode } = await request.json();

        /**
         * New behavior: improve the full resume in ONE call.
         * - `resume`: any JSON (either analysis-style or text-by-section).
         * - Returns JSON with corrected section placement.
         */
        if (resume && typeof resume === 'object') {
            if (!isFinalStep) {
                return NextResponse.json({
                    originalResume: resume,
                    improvedResume: resume,
                    message: 'Improvement will be available in final step',
                });
            }

            const improvedResume = await ChatGPTService.improveStructuredResume({
                resume,
                mode,
            });

            return NextResponse.json({
                originalResume: resume,
                improvedResume,
            });
        }

        // Legacy behavior: improve one section text.
        if (!section) {
            return NextResponse.json({ error: 'Section text is required' }, { status: 400 });
        }

        // فقط در مرحله نهایی از ChatGPT استفاده می‌کنیم
        if (!isFinalStep) {
            return NextResponse.json({
                original: section,
                improved: section, // بدون تغییر برمی‌گردانیم
                message: 'Improvement will be available in final step',
            });
        }

        // Improve CV section using ChatGPT (فقط در مرحله نهایی)
        const improved = await ChatGPTService.improveCVSection(section, context);

        return NextResponse.json({
            original: section,
            improved,
        });
    } catch (error: any) {
        console.error('Error improving CV section:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to improve CV section' },
            { status: 500 }
        );
    }
}
