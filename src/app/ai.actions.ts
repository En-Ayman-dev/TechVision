// // src/app/ai.actions.ts
// "use server";

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { z } from "zod";
// import { Message } from "@/lib/types"; // تأكد من وجود هذا الاستيراد

// const GLOBAL_SYSTEM_PROMPT = `
//   أنت مساعد ذكاء اصطناعي محترف وشامل، مُكلف بالرد على استفسارات العملاء في مشروع "TechVision". 
//   مهمتك هي صياغة ردود احترافية، دقيقة، وودية باللغة العربية.
//   يجب أن تكون الردود مختصرة ومباشرة قدر الإمكان، مع الحفاظ على نبرة مهنية.
//   تجنب استخدام لغة غير رسمية أو إعطاء وعود غير واقعية.
//   ركز على تقديم حلول واضحة وتوجيهات محددة بناءً على استفسار العميل.

//   ملاحظات هامة:
//   - يجب أن يكون ردك منسقًا باستخدام لغة Markdown.
//   - استخدم العناوين (##)، القوائم (- أو *)، والخط العريض (**) لتنظيم الرد.
//   - لا تستخدم أي تنسيق آخر غير Markdown.
// `;

// const geminiConfigSchema = z.object({
//     apiKey: z.string().min(1, "Google Gemini API Key is required."),
// });

// const getGeminiClient = () => {
//     const env = geminiConfigSchema.parse({
//         apiKey: process.env.GOOGLE_GEMINI_API_KEY,
//     });

//     return new GoogleGenerativeAI(env.apiKey);
// };

// export async function chatWithAI(
//     messages: { role: string; content: string }[],
//     originalMessage: Message // تم إضافة هذا المتغير
// ) {
//     try {
//         const genAI = getGeminiClient();
//         const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

//         // بناء محتوى الرسالة الأولى بجميع معلومات العميل
//         const initialMessageContent = `
//             ${GLOBAL_SYSTEM_PROMPT}

//             بيانات العميل:
//             - الاسم: ${originalMessage.name || 'غير محدد'}
//             - البريد الإلكتروني: ${originalMessage.email || 'غير محدد'}
//             - الموضوع: ${originalMessage.submittedAt || 'غير محدد'}
//             - الشركة: ${originalMessage.beneficiaryType || 'غير محدد'}
//             - رقم الهاتف: ${originalMessage.email || 'غير محدد'}

//             رسالة العميل:
//             "${messages[0]?.content}"
//         `;

//         const finalMessages = [
//             {
//                 role: 'user',
//                 parts: [{ text: initialMessageContent }],
//             },
//             ...messages.slice(1).map(msg => ({
//                 role: msg.role === 'assistant' ? 'model' : 'user',
//                 parts: [{ text: msg.content }],
//             })),
//         ];

//         const result = await model.generateContent({
//             contents: finalMessages as any,
//         });

//         const response = await result.response;
//         const text = response.text();

//         return {
//             success: true,
//             data: text,
//         };
//     } catch (error) {
//         console.error("Error communicating with Gemini:", error);
//         return {
//             success: false,
//             error: "Failed to communicate with AI. Please check the API key and your plan.",
//         };
//     }
// }

// src/app/ai.actions.ts
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { Message } from "@/lib/types";

// **البرومت المُحسن**: يحدد الأسلوب، الهيكل، والتنسيق المطلوب للرد
const ENHANCED_GLOBAL_PROMPT = `
  أنت قائد تقني ومدير تطوير أعمال في شركة "TechVision" المتخصصة في حلول الويب والتطبيقات.
  مهمتك هي تحليل استفسارات العملاء وتقديم رد شامل يتكون من جزئين أساسيين.

  الجزء الأول: التحليل الفني والأكاديمي (Technical and Academic Analysis)
  - قدم تحليلًا أكاديميًا لمشروع العميل وفوائده المحتملة.
  - قدم تحليلًا تقنيًا للتقنيات المقترحة أو اللازمة للمشروع (مثل Flutter, Firebase, Next.js, etc.).
  - قدم تقديرًا زمنيًا واقعيًا لإتمام المشروع.

  الجزء الثاني: رسالة الرد على العميل (Client Reply Message)
  - صغ رسالة بريد إلكتروني رسمية وودية للعميل.
  - ابدأ بشكره على اهتمامه وتأكيد استلام طلبه.
  - عبر عن حماسك لفكرة المشروع ووضح أن فريقك يمتلك الخبرة اللازمة.
  - أشر إلى التقدير الزمني الذي تم التوصل إليه.
  - اختم بدعوة العميل للاجتماع لمناقشة التفاصيل بشكل أكبر.

  تعليمات التنسيق:
  - يجب أن يكون الرد باللغة العربية الفصحى.
  - استخدم تنسيق Markdown بشكل صارم.
  - العناوين الرئيسية (مثل "التحليل التقني" و "رسالة الرد") يجب أن تكون بعلامة (##).
  - استخدم القوائم (- أو *) لتنظيم النقاط الفرعية.
  - استخدم الخط العريض (**) لإبراز الكلمات الهامة.
  - أدمج بيانات العميل بشكل طبيعي في رسالة الرد.

  بيانات العميل الحالية:
`;

const geminiConfigSchema = z.object({
    apiKey: z.string().min(1, "Google Gemini API Key is required."),
});

const getGeminiClient = () => {
    const env = geminiConfigSchema.parse({
        apiKey: process.env.GOOGLE_GEMINI_API_KEY,
    });

    return new GoogleGenerativeAI(env.apiKey);
};

export async function chatWithAI(
    messages: { role: string; content: string }[],
    originalMessage: Message
) {
    try {
        if (!originalMessage || !originalMessage.name) {
            console.error("Original message is invalid or undefined.");
            return {
                success: false,
                error: "بيانات الرسالة الأصلية غير متوفرة.",
            };
        }

        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

        // بناء محتوى الرسالة الأولى بجميع معلومات العميل
        const fullClientDataPrompt = `
      ${ENHANCED_GLOBAL_PROMPT}
      
      الاسم: ${originalMessage.name}
      البريد الإلكتروني: ${originalMessage.email}
      نوع المستفيد: ${originalMessage.beneficiaryType}
      نوع الطلب: ${originalMessage.requestType}
      فكرة المشروع: ${originalMessage.message}
      الاستفسار الإضافي: ${originalMessage.inquiry}
    `;

        // دمج البرومت الكامل مع أول رسالة من العميل
        const initialMessageContent = `
      ${fullClientDataPrompt}
      
      الرسالة الأولى من المحادثة:
      "${messages[0]?.content}"
    `;

        const finalMessages = [
            {
                role: 'user',
                parts: [{ text: initialMessageContent }],
            },
            ...messages.slice(1).map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }],
            })),
        ];

        const result = await model.generateContent({
            contents: finalMessages as any,
        });

        const response = await result.response;
        const text = response.text();

        return {
            success: true,
            data: text,
        };
    } catch (error) {
        console.error("Error communicating with Gemini:", error);
        return {
            success: false,
            error: "Failed to communicate with AI. Please check the API key and your plan.",
        };
    }
}