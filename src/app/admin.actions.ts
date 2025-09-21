// // src/app/admin.actions.ts

// 'use server';

// import { z } from 'zod';
// import { db } from '@/lib/firebase-admin';
// import { auth } from 'firebase-admin';
// import { revalidatePath } from 'next/cache';
// import { ContactMethod } from '@/lib/types';
// import { cookies } from 'next/headers'; 

// // ====================================================================
// // SECURITY HELPERS - دوال التحقق من صلاحيات المدير الآمنة
// // ====================================================================

// /**
//  * Verifies the session cookie and returns the decoded user token.
//  * Throws an error if the session is invalid or not found.
//  * @returns {Promise<auth.DecodedIdToken>} The decoded user token.
//  */
// async function getAuthenticatedUser(): Promise<auth.DecodedIdToken> {
//     const sessionCookie = (await cookies()).get('session')?.value;
//     if (!sessionCookie) {
//         throw new Error('Unauthorized: No session cookie found. Please log in.');
//     }

//     try {
//         // التحقق من صحة الكوكي وإرجاع بيانات المستخدم
//         const decodedToken = await auth().verifySessionCookie(sessionCookie, true);
//         return decodedToken;
//     } catch (error) {
//         // في حالة فشل التحقق (مثلاً: انتهاء صلاحية الجلسة)
//         throw new Error('Unauthorized: Invalid session. Please log in again.');
//     }
// }

// /**
//  * Verifies if the current authenticated user is the admin.
//  * It compares the user's UID with the ADMIN_FIREBASE_UID from environment variables.
//  * Throws an error if the user is not authenticated or not an admin.
//  */
// export async function verifyIsAdmin() {
//     // التأكد من أن متغير البيئة الخاص بالمدير مُعرَّف
//     if (!process.env.ADMIN_FIREBASE_UID) {
//         console.error('CRITICAL SECURITY ERROR: ADMIN_FIREBASE_UID is not set in environment variables.');
//         throw new Error('Server configuration error.');
//     }

//     try {
//         // 1. الحصول على بيانات المستخدم المسجل دخوله
//         const user = await getAuthenticatedUser();
        
//         // 2. التحقق من أن المستخدم هو المدير
//         if (user.uid !== process.env.ADMIN_FIREBASE_UID) {
//             throw new Error('Forbidden: You do not have permission to perform this action.');
//         }

//         // 3. إذا كان هو المدير، لا يتم عمل أي شيء وتستمر الدالة التالية
//         console.log(`Admin action verified for user: ${user.uid}`);

//     } catch (error: any) {
//         // إعادة إطلاق الخطأ سواء كان من getAuthenticatedUser أو من التحقق نفسه
//         throw new Error(error.message);
//     }
// }


// // ====================================================================
// // ZOD SCHEMA - مخطط التحقق من البيانات
// // ====================================================================
// const contactMethodSchema = z.object({
//     id: z.string().optional(),
//     name: z.string().min(2, 'Name must be at least 2 characters.'),
//     label_en: z.string().min(2, 'English label is required.'),
//     label_ar: z.string().min(2, 'Arabic label is required.'),
//     placeholder_en: z.string().min(2, 'English placeholder is required.'),
//     placeholder_ar: z.string().min(2, 'Arabic placeholder is required.'),
//     inputType: z.enum(['text', 'tel', 'email', 'url']),
//     icon: z.string().optional(),
// });


// // ====================================================================
// // FIRESTORE COLLECTION - مرجع مجموعة البيانات في قاعدة البيانات
// // ====================================================================
// const contactMethodsCollection = db.collection('contactMethods');


// // ====================================================================
// // SERVER ACTIONS - دوال التحكم
// // ====================================================================

// /**
//  * Fetches all contact methods from Firestore.
//  * This is a public action and does not require admin verification.
//  */
// export async function getContactMethodsAction(): Promise<ContactMethod[]> {
//     try {
//         const snapshot = await contactMethodsCollection.get();
//         if (snapshot.empty) {
//             return [];
//         }
//         return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMethod));
//     } catch (error) {
//         console.error("Error fetching contact methods:", error);
//         return []; // Return empty array on error
//     }
// }

// /**
//  * Adds a new contact method. (Admin only)
//  */
// export async function addContactMethodAction(formData: FormData) {
//     try {
//         await verifyIsAdmin(); // <-- 1. التحقق من صلاحيات المدير أولاً

//         const data = Object.fromEntries(formData.entries());
//         const validatedFields = contactMethodSchema.safeParse(data);

//         if (!validatedFields.success) {
//             return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: 'Validation failed.' };
//         }

//         const { id, ...contactMethodData } = validatedFields.data;
//         await contactMethodsCollection.add(contactMethodData);

//         revalidatePath('/[locale]/admin/settings', 'page'); // 2. تحديث الكاش
//         return { success: true, message: 'Contact method added successfully.' };

//     } catch (error: any) {
//         return { success: false, message: error.message || 'Failed to add contact method.' };
//     }
// }

// /**
//  * Updates an existing contact method. (Admin only)
//  */
// export async function updateContactMethodAction(formData: FormData) {
//     try {
//         await verifyIsAdmin(); // <-- 1. التحقق من صلاحيات المدير أولاً

//         const data = Object.fromEntries(formData.entries());
//         const validatedFields = contactMethodSchema.safeParse(data);

//         if (!validatedFields.success) {
//             return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: 'Validation failed.' };
//         }

//         const { id, ...contactMethodData } = validatedFields.data;
//         if (!id) {
//             throw new Error("Contact method ID is missing for update.");
//         }

//         await contactMethodsCollection.doc(id).set(contactMethodData, { merge: true });

//         revalidatePath('/[locale]/admin/settings', 'page'); // 2. تحديث الكاش
//         return { success: true, message: 'Contact method updated successfully.' };

//     } catch (error: any) {
//         return { success: false, message: error.message || 'Failed to update contact method.' };
//     }
// }

// /**
//  * Deletes a contact method. (Admin only)
//  */
// export async function deleteContactMethodAction(id: string) {
//     try {
//         await verifyIsAdmin(); // <-- 1. التحقق من صلاحيات المدير أولاً

//         if (!id) {
//             return { success: false, message: 'Contact method ID is required for deletion.' };
//         }

//         await contactMethodsCollection.doc(id).delete();

//         revalidatePath('/[locale]/admin/settings', 'page'); // 2. تحديث الكاش
//         return { success: true, message: 'Contact method deleted.' };

//     } catch (error: any) {
//         return { success: false, message: error.message || 'Failed to delete contact method.' };
//     }
// }

// src/app/admin.actions.ts

'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { auth } from 'firebase-admin';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers'; // <-- 1. استيراد دالة cookies
import { ContactMethod } from '@/lib/types';

// ====================================================================
// SECURITY HELPERS - دوال التحقق من صلاحيات المدير الآمنة
// ====================================================================

/**
 * Verifies the session cookie and returns the decoded user token.
 * Throws an error if the session is invalid or not found.
 * @returns {Promise<auth.DecodedIdToken>} The decoded user token.
 */
async function getAuthenticatedUser(): Promise<auth.DecodedIdToken> {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
        throw new Error('Unauthorized: No session cookie found. Please log in.');
    }

    try {
        // التحقق من صحة الكوكي وإرجاع بيانات المستخدم
        const decodedToken = await auth().verifySessionCookie(sessionCookie, true);
        return decodedToken;
    } catch (error) {
        // في حالة فشل التحقق (مثلاً: انتهاء صلاحية الجلسة)
        throw new Error('Unauthorized: Invalid session. Please log in again.');
    }
}

/**
 * Verifies if the current authenticated user is the admin.
 * It compares the user's UID with the ADMIN_FIREBASE_UID from environment variables.
 * Throws an error if the user is not authenticated or not an admin.
 */
export async function verifyIsAdmin() {
    // التأكد من أن متغير البيئة الخاص بالمدير مُعرَّف
    if (!process.env.ADMIN_FIREBASE_UID) {
        console.error('CRITICAL SECURITY ERROR: ADMIN_FIREBASE_UID is not set in environment variables.');
        throw new Error('Server configuration error.');
    }

    try {
        // 1. الحصول على بيانات المستخدم المسجل دخوله
        const user = await getAuthenticatedUser();
        
        // 2. التحقق من أن المستخدم هو المدير
        if (user.uid !== process.env.ADMIN_FIREBASE_UID) {
            throw new Error('Forbidden: You do not have permission to perform this action.');
        }

        // 3. إذا كان هو المدير، لا يتم عمل أي شيء وتستمر الدالة التالية
        console.log(`Admin action verified for user: ${user.uid}`);

    } catch (error: any) {
        // إعادة إطلاق الخطأ سواء كان من getAuthenticatedUser أو من التحقق نفسه
        throw new Error(error.message);
    }
}


// ====================================================================
// ZOD SCHEMA - مخطط التحقق من البيانات
// ====================================================================
const contactMethodSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    label_en: z.string().min(2, 'English label is required.'),
    label_ar: z.string().min(2, 'Arabic label is required.'),
    placeholder_en: z.string().min(2, 'English placeholder is required.'),
    placeholder_ar: z.string().min(2, 'Arabic placeholder is required.'),
    inputType: z.enum(['text', 'tel', 'email', 'url']),
    icon: z.string().optional(),
});


// ====================================================================
// FIRESTORE COLLECTION - مرجع مجموعة البيانات في قاعدة البيانات
// ====================================================================
const contactMethodsCollection = db.collection('contactMethods');


// ====================================================================
// SERVER ACTIONS - دوال التحكم
// ====================================================================

/**
 * Fetches all contact methods from Firestore.
 * This is a public action and does not require admin verification.
 */
export async function getContactMethodsAction(): Promise<ContactMethod[]> {
    try {
        const snapshot = await contactMethodsCollection.get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMethod));
    } catch (error) {
        console.error("Error fetching contact methods:", error);
        return [];
    }
}

/**
 * Adds a new contact method. (Admin only)
 */
export async function addContactMethodAction(formData: FormData) {
    try {
        await verifyIsAdmin(); // <-- الآن هذه دالة حقيقية

        const data = Object.fromEntries(formData.entries());
        const validatedFields = contactMethodSchema.safeParse(data);

        if (!validatedFields.success) {
            return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: 'Validation failed.' };
        }

        const { id, ...contactMethodData } = validatedFields.data;
        await contactMethodsCollection.add(contactMethodData);

        revalidatePath('/[locale]/admin/settings', 'page');
        return { success: true, message: 'Contact method added successfully.' };

    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to add contact method.' };
    }
}

/**
 * Updates an existing contact method. (Admin only)
 */
export async function updateContactMethodAction(formData: FormData) {
    try {
        await verifyIsAdmin(); // <-- الآن هذه دالة حقيقية

        const data = Object.fromEntries(formData.entries());
        const validatedFields = contactMethodSchema.safeParse(data);

        if (!validatedFields.success) {
            return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: 'Validation failed.' };
        }

        const { id, ...contactMethodData } = validatedFields.data;
        if (!id) {
            throw new Error("Contact method ID is missing for update.");
        }

        await contactMethodsCollection.doc(id).set(contactMethodData, { merge: true });

        revalidatePath('/[locale]/admin/settings', 'page');
        return { success: true, message: 'Contact method updated successfully.' };

    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to update contact method.' };
    }
}

/**
 * Deletes a contact method. (Admin only)
 */
export async function deleteContactMethodAction(id: string) {
    try {
        await verifyIsAdmin(); // <-- الآن هذه دالة حقيقية

        if (!id) {
            return { success: false, message: 'Contact method ID is required for deletion.' };
        }

        await contactMethodsCollection.doc(id).delete();

        revalidatePath('/[locale]/admin/settings', 'page');
        return { success: true, message: 'Contact method deleted.' };

    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to delete contact method.' };
    }
}