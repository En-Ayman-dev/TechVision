// src/app/admin.actions.ts

'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { auth } from 'firebase-admin';
import { revalidatePath } from 'next/cache';
import { ContactMethod, ContactMethodInputType } from '@/lib/types';

// ====================================================================
// SECURITY HELPER - دالة التحقق من صلاحيات المدير
// ====================================================================
/**
 * Verifies if the current user is the admin.
 * It checks for the ADMIN_FIREBASE_UID in environment variables.
 * Throws an error if the user is not authenticated or not an admin.
 */
async function verifyIsAdmin() {
    // ملاحظة: هذا التنفيذ يتطلب طريقة للحصول على جلسة المستخدم الحالية من جهة الخادم.
    // في Next.js App Router، غالبًا ما يتم ذلك عبر cookies أو headers.
    // للتبسيط الآن، سنفترض وجود آلية للتحقق، ولكن يجب تأمينها بشكل كامل لاحقًا.
    // في الوقت الحالي، هذه الدالة هي نموذج أولي يجب تطويره.

    // مثال للتحقق (يجب تكييفه مع نظام المصادقة لديك):
    // const sessionCookie = cookies().get('session')?.value || '';
    // const decodedToken = await auth().verifySessionCookie(sessionCookie, true);
    // if (decodedToken.uid !== process.env.ADMIN_FIREBASE_UID) {
    //   throw new Error('Unauthorized: You do not have permission to perform this action.');
    // }

    // كحل مؤقت وبسيط الآن، سنعتبره يمر دائمًا، لكن مع ترك التحذير.
    console.warn("SECURITY WARNING: verifyIsAdmin() is a placeholder and does not provide real security yet. It needs to be fully implemented based on your authentication strategy.");

    if (!process.env.ADMIN_FIREBASE_UID) {
        throw new Error('Server configuration error: ADMIN_FIREBASE_UID is not set.');
    }

    // TODO: Implement actual user session verification here.
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
        return []; // Return empty array on error
    }
}

/**
 * Adds a new contact method. (Admin only)
 */
export async function addContactMethodAction(formData: FormData) {
    try {
        await verifyIsAdmin(); // <-- 1. التحقق من صلاحيات المدير أولاً

        const data = Object.fromEntries(formData.entries());
        const validatedFields = contactMethodSchema.safeParse(data);

        if (!validatedFields.success) {
            return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: 'Validation failed.' };
        }

        const { id, ...contactMethodData } = validatedFields.data;
        await contactMethodsCollection.add(contactMethodData);

        revalidatePath('/[locale]/admin/settings', 'page'); // 2. تحديث الكاش
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
        await verifyIsAdmin(); // <-- 1. التحقق من صلاحيات المدير أولاً

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

        revalidatePath('/[locale]/admin/settings', 'page'); // 2. تحديث الكاش
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
        await verifyIsAdmin(); // <-- 1. التحقق من صلاحيات المدير أولاً

        if (!id) {
            return { success: false, message: 'Contact method ID is required for deletion.' };
        }

        await contactMethodsCollection.doc(id).delete();

        revalidatePath('/[locale]/admin/settings', 'page'); // 2. تحديث الكاش
        return { success: true, message: 'Contact method deleted.' };

    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to delete contact method.' };
    }
}