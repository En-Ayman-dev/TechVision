// // src/app/api/auth/session/route.ts

// import { auth } from 'firebase-admin';
// import { NextResponse, type NextRequest } from 'next/server';

// /**
//  * API Route to create a session cookie upon successful client-side login.
//  * It relies on the initialization logic from '@lib/firebase-admin'.
//  */
// export async function POST(request: NextRequest) {
//     try {
//         const { idToken } = await request.json();
//         if (!idToken) {
//             return NextResponse.json(
//                 { success: false, error: 'ID token is required.' },
//                 { status: 400 }
//             );
//         }

//         const expiresIn = 60 * 60 * 24 * 5 * 1000; 

//         const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });

//         const options = {
//             name: 'session',
//             value: sessionCookie,
//             maxAge: expiresIn,
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production', 
//             path: '/',
//         };

//         const response = NextResponse.json({ success: true, status: 'Signed in successfully.' });
//         response.cookies.set(options);

//         return response;

//     } catch (error: any) {
//         console.error('Session Login Error:', error);
//         return NextResponse.json(
//             { success: false, error: 'Failed to create session.', details: error.message },
//             { status: 401 } 
//         );
//     }
// }

// src/app/api/auth/session/route.ts

import { NextResponse, type NextRequest } from 'next/server';
// نستورد auth مباشرة من ملفنا المهيأ
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();
        if (!idToken) {
            return NextResponse.json({ success: false, error: 'ID token is required.' }, { status: 400 });
        }

        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

        // الآن auth() مضمونة أنها مهيأة
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

        const options = {
            name: 'session',
            value: sessionCookie,
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        };

        const response = NextResponse.json({ success: true, status: 'Signed in successfully.' });
        response.cookies.set(options);
        return response;

    } catch (error: any) {
        console.error('Session Login Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create session.', details: error.message }, { status: 401 });
    }
}