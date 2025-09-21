

// "use client";

// import { useEffect, useState } from "react";
// import { Textarea } from "../ui/textarea";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
// import { useTranslations } from "next-intl";
// import { Separator } from "../ui/separator";
// import { chatWithAI } from "@/app/ai.actions";
// import { Button } from "../ui/button";
// import { Message } from "@/lib/types";
// import { useToast } from "@/hooks/use-toast"; // <-- تم إصلاح الخطأ: إعادة استيراد useToast
// import ReactMarkdown from 'react-markdown'; // <-- الإضافة الجديدة لعرض التنسيق

// interface AIChatProps {
//     // تمت إعادة originalMessage كما كان
//     originalMessage: Message;
// }

// const AIChat = ({ originalMessage }: AIChatProps) => {
//     const t = useTranslations("AdminMessages");
//     const { toast } = useToast(); // <-- تم إصلاح الخطأ: تعريف toast
//     const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
//     const [input, setInput] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [finalResponse, setFinalResponse] = useState("");

//     useEffect(() => {
//         // تم إعادة المنطق الأصلي الخاص بك
//         setMessages([
//             { role: "system", content: "You are an AI assistant helping a business owner draft professional and helpful responses to customer inquiries. The original customer message is: " + originalMessage.message },
//             { role: "user", content: originalMessage.message },
//         ]);
//     }, [originalMessage]);

//     const handleSendMessage = async () => {
//         if (!input.trim()) return;

//         setLoading(true);
//         const newMessages = [...messages, { role: "user", content: input }];
//         setMessages(newMessages);
//         setInput("");

//         // تم إعادة استدعاء الدالة بنفس الطريقة القديمة لتجنب الأخطاء
//         const result = await chatWithAI(newMessages as any[], originalMessage);

//         if (result.success && result.data) {
//             const aiResponse = result.data;
//             setMessages([...newMessages, { role: "assistant", content: aiResponse }]);
//             setFinalResponse(aiResponse);
//         } else {
//             // Use the `error` property that exists on the result type
//             const errorMessage = result.error || t("aiError");
//             setMessages([...newMessages, { role: "assistant", content: errorMessage }]);
//             setFinalResponse(errorMessage);
//         }
//         setLoading(false);
//     };

//     const handleCopy = () => {
//         navigator.clipboard.writeText(finalResponse);
//         // تم التأكد من أن toast تعمل الآن
//         toast({ title: t("copied") });
//     };

//     const emailLink = `mailto:${originalMessage.email}?subject=${t("replySubject")}&body=${encodeURIComponent(finalResponse)}`;
//     const whatsappLink = `https://wa.me/?text=${encodeURIComponent(finalResponse)}`;
//     const telegramLink = `https://t.me/share/url?text=${encodeURIComponent(finalResponse)}`;

//     return (
//         <Card className="flex flex-col h-full">
//             <CardHeader>
//                 <CardTitle>{t("replyToMessage")}</CardTitle>
//             </CardHeader>
//             <CardContent className="flex-1 overflow-y-auto space-y-4">
//                 <div className="bg-muted p-4 rounded-lg">
//                     <p className="font-semibold">{t("from")}: {originalMessage.name}</p>
//                     <p className="text-sm text-gray-500">{t("email")}: {originalMessage.email}</p>
//                     <Separator className="my-2" />
//                     <p>{originalMessage.message}</p>
//                 </div>
//                 <div className="space-y-4">
//                     {messages.map((msg, index) => (
//                         <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
//                             <div className={`p-3 rounded-lg max-w-[70%] ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
//                                 <p className="text-sm font-semibold">{msg.role === "user" ? t("you") : t("ai")}</p>

//                                 {/* ========= التغيير الوحيد والمطلوب هو هنا ========= */}
//                                 <div className="prose prose-sm dark:prose-invert prose-p:my-0">
//                                     <ReactMarkdown>{msg.content}</ReactMarkdown>
//                                 </div>
//                                 {/* ============================================ */}

//                             </div>
//                         </div>
//                     ))}
//                     {loading && (
//                         <div className="text-center text-sm text-muted-foreground">{t("typing")}...</div>
//                     )}
//                 </div>
//             </CardContent>
//             <CardFooter className="flex-col">
//                 {finalResponse && (
//                     <div className="w-full flex justify-between items-center mb-4">
//                         <Button onClick={handleCopy}>{t("copy")}</Button>
//                         <div className="flex gap-2">
//                             <a href={emailLink} target="_blank" rel="noopener noreferrer">
//                                 <Button variant="outline">{t("sendEmail")}</Button>
//                             </a>
//                             <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
//                                 <Button variant="outline">{t("sendWhatsapp")}</Button>
//                             </a>
//                             <a href={telegramLink} target="_blank" rel="noopener noreferrer">
//                                 <Button variant="outline">{t("sendTelegram")}</Button>
//                             </a>
//                         </div>
//                     </div>
//                 )}
//                 <div className="w-full flex gap-2">
//                     <Textarea
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         placeholder={t("typeMessage")}
//                         className="flex-1"
//                     />
//                     <Button onClick={handleSendMessage} disabled={loading}>{t("send")}</Button>
//                 </div>
//             </CardFooter>
//         </Card>
//     );
// };

// export default AIChat;

// src/components/admin/AIChat.tsx

"use client";

// 1. استيراد useRef و useEffect
import { useEffect, useState, useRef } from "react";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import { chatWithAI } from "@/app/ai.actions";
import { Button } from "../ui/button";
import { Message } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';

interface AIChatProps {
    originalMessage: Message;
}

const AIChat = ({ originalMessage }: AIChatProps) => {
    const t = useTranslations("AdminMessages");
    const { toast } = useToast();
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [finalResponse, setFinalResponse] = useState("");

    // 2. إنشاء ref لحاوية الرسائل
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([
            { role: "system", content: "You are an AI assistant helping a business owner draft professional and helpful responses to customer inquiries. The original customer message is: " + originalMessage.message },
            { role: "user", content: originalMessage.message },
        ]);
    }, [originalMessage]);

    // 3. إضافة useEffect للتمرير التلقائي
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, loading]); // يتم التشغيل عند تغيير الرسائل أو حالة التحميل

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        setLoading(true);
        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");

        const result = await chatWithAI(newMessages as any[], originalMessage);

        if (result.success && result.data) {
            const aiResponse = result.data;
            setMessages([...newMessages, { role: "assistant", content: aiResponse }]);
            setFinalResponse(aiResponse);
        } else {
            const errorMessage = result.error || t("aiError");
            setMessages([...newMessages, { role: "assistant", content: errorMessage }]);
            setFinalResponse(errorMessage);
        }
        setLoading(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(finalResponse);
        toast({ title: t("copied") });
    };

    const emailLink = `mailto:${originalMessage.email}?subject=${t("replySubject")}&body=${encodeURIComponent(finalResponse)}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(finalResponse)}`;
    const telegramLink = `https://t.me/share/url?text=${encodeURIComponent(finalResponse)}`;

    return (
        // تم التأكيد على أن هذا العنصر يجب أن يكون flex container عمودي
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>{t("replyToMessage")}</CardTitle>
            </CardHeader>
            {/* 4. ربط الـ ref وتعديل طفيف في CSS */}
            <CardContent ref={messagesContainerRef} className="flex-grow overflow-y-auto space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                    <p className="font-semibold">{t("from")}: {originalMessage.name}</p>
                    <p className="text-sm text-gray-500">{t("email")}: {originalMessage.email}</p>
                    <Separator className="my-2" />
                    <p>{originalMessage.message}</p>
                </div>
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`p-3 rounded-lg max-w-[70%] ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                                <p className="text-sm font-semibold">{msg.role === "user" ? t("you") : t("ai")}</p>
                                <div className="prose prose-sm dark:prose-invert prose-p:my-0">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="text-center text-sm text-muted-foreground">{t("typing")}...</div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex-col pt-4"> {/* إضافة padding top */}
                {finalResponse && (
                    <div className="w-full flex justify-between items-center mb-4">
                        <Button onClick={handleCopy}>{t("copy")}</Button>
                        <div className="flex gap-2">
                            <a href={emailLink} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">{t("sendEmail")}</Button>
                            </a>
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">{t("sendWhatsapp")}</Button>
                            </a>
                            <a href={telegramLink} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">{t("sendTelegram")}</Button>
                            </a>
                        </div>
                    </div>
                )}
                <div className="w-full flex gap-2">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t("typeMessage")}
                        className="flex-1"
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    />
                    <Button onClick={handleSendMessage} disabled={loading}>{t("send")}</Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default AIChat;