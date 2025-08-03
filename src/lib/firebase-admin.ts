import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env') });

import admin from 'firebase-admin';

export let db: admin.firestore.Firestore;

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

// Only initialize the app if all required environment variables are present
if (projectId && clientEmail && privateKey) {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          // The private key needs to have newlines escaped in the .env file
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      db = admin.firestore();
    } catch (error) {
      console.error("Firebase Admin initialization error:", error);
      // Assign a dummy object to db to prevent further errors during runtime
      db = { collection: () => null } as unknown as admin.firestore.Firestore;
    }
  } else {
    db = admin.app().firestore();
  }
} else {
  console.warn(
    "Firebase Admin SDK not initialized. Missing required environment variables: NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY"
  );
  // Assign a dummy object to db to prevent crashes in other parts of the app
  // that might try to use it.
  db = { collection: () => null } as unknown as admin.firestore.Firestore;
}
