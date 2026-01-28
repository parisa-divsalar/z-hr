import { NextRequest, NextResponse } from 'next/server';
import { ChatGPTService } from '@/services/chatgpt/service';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'File is required' }, { status: 400 });
        }

        // Extract text from file using ChatGPT
        const extractedText = await ChatGPTService.extractTextFromFile(file);

        return NextResponse.json({
            text: extractedText,
            fileName: file.name,
            fileType: file.type,
        });
    } catch (error: any) {
        console.error('Error extracting text from file:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to extract text from file' },
            { status: 500 }
        );
    }
}
