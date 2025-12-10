import { AxiosError } from 'axios';
import FormData from 'form-data';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { apiClientServer } from '@/services/api-client';
import CacheError from '@/services/cache-error';

export async function POST(req: NextRequest) {
    try {
        const formDataClient = await req.formData();
        const file = formDataClient.get('inputFile') as File;
        const userId = (await cookies()).get('accessToken');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const externalFormData = new FormData();
        externalFormData.append('inputFile', buffer, file.name);

        const response = await apiClientServer.post(`SendFile?userId=${userId}&lang=en`, externalFormData, {
            headers: externalFormData.getHeaders ? externalFormData.getHeaders() : {},
        });

        return NextResponse.json({ result: response.data });
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
