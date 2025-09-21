// src/app/api/auth/logout/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Route to handle user logout by clearing the session cookie.
 */
export async function POST(request: NextRequest) {
    try {
        // إعداد خيارات لمسح الكوكي
        const options = {
            name: 'session',
            value: '', // قيمة فارغة
            maxAge: -1, // تاريخ انتهاء صلاحية في الماضي
            path: '/',
        };

        // إنشاء استجابة ومسح الكوكي من خلالها
        const response = NextResponse.json({ success: true, status: 'Signed out successfully.' });
        response.cookies.set(options);

        return response;

    } catch (error: any) {
        console.error('Session Logout Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to sign out.' },
            { status: 500 }
        );
    }
}