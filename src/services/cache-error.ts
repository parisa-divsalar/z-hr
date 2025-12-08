import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

const CacheError = (error: AxiosError) => {
    const status = error?.response?.status || 500;
    const data = error?.response?.data || { message: error.message };

    console.log('Server side error', error);
    return NextResponse.json({ error: data }, { status });
};

export default CacheError;
