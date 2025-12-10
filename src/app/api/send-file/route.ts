import CacheError from '@/services/cache-error';
import { cookies } from 'next/headers';
import { AxiosError } from 'axios';
import { apiClientServer } from '@/services/api-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formDataClient = await req.formData();

        const token = (await cookies()).get('accessToken')?.value.split('"');
        if (!token) {
            return NextResponse.json({ error: 'No access token' }, { status: 401 });
        }

        const response = await apiClientServer.post(`SendFile?userId=${token[1]}&lang=en`, formDataClient, {
            headers: {
                accept: 'text/plain',
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('response === = = =++++++++++++++++++++++++++++++++++++ = ', response);
        return NextResponse.json({ result: response.data });
    } catch (error) {
        console.log('err === = = == = = == == = = = ', error);

        return CacheError(error as AxiosError);
    }
}
