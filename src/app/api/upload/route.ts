import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename || !request.body) {
        return NextResponse.json({ error: 'Filename and body required' }, { status: 400 });
    }

    // Check token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('Missing BLOB_READ_WRITE_TOKEN');
        return NextResponse.json({ error: 'Server configuration error: Missing Blob Token' }, { status: 500 });
    }

    try {
        const blob = await put(filename, request.body, {
            access: 'public',
        });

        return NextResponse.json(blob);
    } catch (error) {
        console.error('Error uploading blob:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
