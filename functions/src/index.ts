import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Resend} from "resend";

admin.initializeApp();

// Here we use the OLD but working functions.config()
// It's deprecated but will work fine until 2026 and on the free plan.
const resendApiKey = functions.config().resend.apikey;
const adminEmail = functions.config().admin.email;

export const onNewContactMessage = functions
  .region("europe-west1")
  .firestore.document("contactMessages/{messageId}")
  .onCreate(async (snap, context) => {
    const newMessage = snap.data();
    const {messageId} = context.params;

    functions.logger.log(`New v1 message received: ${messageId}`, newMessage);

    if (!resendApiKey || !adminEmail) {
      functions.logger.error("API Key or Admin Email is not configured.");
      return;
    }

    const resend = new Resend(resendApiKey);
    const siteName = "TechVision";

    try {
      const projectId = process.env.GCLOUD_PROJECT || "default";
      const sender = ` <notifications@${projectId}.firebaseapp.com>`;

      await resend.emails.send({
        from: sender,
        to: adminEmail,
        subject: `🚀 New Message from ${newMessage.name} on ${siteName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Contact Message Received</h2>
            <p><strong>Name:</strong> ${newMessage.name}</p>
            <p><strong>Email:</strong> ${newMessage.email}</p>
            <p><strong>Message:</strong></p>
            <blockquote>${newMessage.message}</blockquote>
          </div>
        `,
      });
      functions.logger.log(`Email sent successfully for ${messageId}`);
    } catch (error) {
      functions.logger.error(`Failed to send email for ${messageId}`, error);
    }
  });
