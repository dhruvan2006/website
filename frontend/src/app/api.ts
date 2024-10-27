import { headers } from 'next/headers';

export async function customFetch(url: string, options: RequestInit = {}) {
    const frontendKey = process.env.FRONTEND_KEY;
    const defaultHeaders = {
        'X-Frontend-Key': frontendKey as string,
        'Cache-Control': 'no-store',
        ...options.headers,
    };

    return fetch(url, {
        ...options,
        headers: defaultHeaders,
        cache: 'no-store',
    });
}