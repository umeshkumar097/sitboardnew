import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { UserSession } from '@/lib/types';
import db from './db';
import crypto from 'crypto';

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const [salt, keyHex] = storedHash.split(':');
        if (!salt || !keyHex) return resolve(false);
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(keyHex === derivedKey.toString('hex'));
        });
    });
}

export async function getSession(): Promise<UserSession | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
        return payload as unknown as UserSession;
    } catch (error) {
        return null;
    }
}

export async function login(formData: FormData) {
    // This function is intended for Server Actions if used, 
    // but we are using API routes due to "Rest-style APIs" requirement.
    // So likely this file will just hold utilities.
}

export async function createSession(user: any) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const session = await new SignJWT(user)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);

    const cookieStore = await cookies();
    cookieStore.set('session_token', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session_token');
}
