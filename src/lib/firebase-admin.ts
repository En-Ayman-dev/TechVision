// import { config } from 'dotenv';
// import path from 'path';
// config({ path: path.resolve(process.cwd(), '.env') });

// import admin from 'firebase-admin';

// export let db: admin.firestore.Firestore;

// const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
// const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// const privateKey = process.env.FIREBASE_PRIVATE_KEY;

// // Only initialize the app if all required environment variables are present
// if (projectId && clientEmail && privateKey) {
//   if (!admin.apps.length) {
//     try {
//       admin.initializeApp({
//         credential: admin.credential.cert({
//           projectId: projectId,
//           clientEmail: clientEmail,
//           // The private key needs to have newlines escaped in the .env file
//           privateKey: privateKey.replace(/\\n/g, '\n'),
//         }),
//       });
//       db = admin.firestore();
//     } catch (error) {
//       console.error("Firebase Admin initialization error:", error);
//       // Assign a dummy object to db to prevent further errors during runtime
//       db = { collection: () => null } as unknown as admin.firestore.Firestore;
//     }
//   } else {
//     db = admin.app().firestore();
//   }
// } else {
//   console.warn(
//     "Firebase Admin SDK not initialized. Missing required environment variables: NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY"
//   );
//   // Assign a dummy object to db to prevent crashes in other parts of the app
//   // that might try to use it.
//   db = { collection: () => null } as unknown as admin.firestore.Firestore;
// }
// src/lib/firebase-admin.ts

import admin from 'firebase-admin';

// دالة مساعدة لضمان التهيئة مرة واحدة فقط
export function initAdminApp() {
  // إذا كان التطبيق مهيأ بالفعل، لا تفعل شيئًا
  if (admin.apps.length > 0) {
    return;
  }

  // قراءة متغيرات البيئة
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // التحقق من وجود المتغيرات
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin SDK environment variables are not set.');
  }

  // تهيئة التطبيق
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error("Firebase Admin initialization error:", error.stack);
    throw new Error("Failed to initialize Firebase Admin SDK.");
  }
}

// تهيئة قاعدة البيانات بعد التأكد من التهيئة
initAdminApp();
export const db = admin.firestore();
export const auth = admin.auth(); // <-- نقوم بتصدير auth مباشرة من هنا