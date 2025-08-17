// "use client";

// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { deleteMessageAction, getMessagesAction, sendReplyAction } from "@/app/actions";
// import { format } from "date-fns";
// import { useEffect, useState, useTransition } from "react";
// import type { Message } from "@/lib/types";
// import { Button } from "@/components/ui/button";
// import { Trash2, Reply, Send } from "lucide-react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { useToast } from "@/hooks/use-toast";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useTranslations } from "next-intl";
// import { Loader2 } from "lucide-react";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";

// const MESSAGE_LIMIT = 5; // New constant for pagination limit

// export default function MessagesPage() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isPending, startTransition] = useTransition();
//   const [lastVisibleId, setLastVisibleId] = useState<string | undefined>(undefined);
//   const [hasMore, setHasMore] = useState(true);

//   const { toast } = useToast();
//   const t = useTranslations("Admin.messagesPage");
//   const tGeneral = useTranslations("Admin.general");

//   const [isFullMessageDialogOpen, setIsFullMessageDialogOpen] = useState(false);
//   const [fullMessageContent, setFullMessageContent] = useState({ title: '', content: '' });
  
//   const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
//   const [replyData, setReplyData] = useState({
//     to: '',
//     subject: '',
//     originalMessage: '',
//     replyContent: '',
//     isSending: false
//   });

//   const fetchMessages = () => {
//     if (isPending) return;
//     startTransition(async () => {
//       // Corrected call to the new getMessagesAction with pagination parameters
//       const result = await getMessagesAction(MESSAGE_LIMIT, lastVisibleId);
//       if (result.messages.length > 0) {
//         setMessages((prev) => lastVisibleId ? [...prev, ...result.messages] : result.messages); // Fix for repeated messages
//         setLastVisibleId(result.lastVisibleId);
//         if (result.messages.length < MESSAGE_LIMIT) {
//           setHasMore(false);
//         }
//       } else {
//         setHasMore(false);
//       }
//     });
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   const handleDelete = async (id: string) => {
//     startTransition(async () => {
//       const result = await deleteMessageAction(id);
//       if (result.success) {
//         setMessages((prev) => prev.filter((m) => m.id !== id));
//         toast({
//           title: tGeneral("itemDeleted", { item: t("item") }),
//           description: tGeneral("itemDeletedDesc", { item: t("item") }),
//         });
//       } else {
//         toast({
//           title: tGeneral("error"),
//           description: result.message,
//           variant: "destructive",
//         });
//       }
//     });
//   };

//   const handleViewFullMessage = (title: string, content: string) => {
//     setFullMessageContent({ title, content });
//     setIsFullMessageDialogOpen(true);
//   };
  
//   const handleReplyClick = (message: Message) => {
//     const originalMessage = `Beneficiary Type: ${message.beneficiaryType}\nRequest Type: ${message.requestType}\n\nProject Idea:\n${message.message}\n\nInquiry:\n${message.inquiry}`;
//     setReplyData({
//       to: message.email,
//       subject: `Re: Your inquiry from TechVision website`,
//       originalMessage,
//       replyContent: '',
//       isSending: false
//     });
//     setIsReplyDialogOpen(true);
//   };

//   const handleSendReply = async () => {
//     setReplyData(prev => ({ ...prev, isSending: true }));
//     const result = await sendReplyAction({
//       to: replyData.to,
//       subject: replyData.subject,
//       body: replyData.replyContent,
//     });
//     if (result.success) {
//       toast({
//         title: t("replySentTitle"),
//         description: t("replySentDesc"),
//       });
//       setIsReplyDialogOpen(false);
//     } else {
//       toast({
//         title: tGeneral("error"),
//         description: result.message,
//         variant: "destructive",
//       });
//     }
//     setReplyData(prev => ({ ...prev, isSending: false }));
//   };

//   const truncateText = (text: string, maxLength: number) => {
//     if (!text) return "";
//     if (text.length <= maxLength) {
//       return text;
//     }
//     return text.substring(0, maxLength) + "...";
//   };

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
//       <Card>
//         <CardHeader>
//           <CardTitle>{t("inboxTitle")}</CardTitle>
//           <CardDescription>
//             {t("inboxDesc")}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-[180px]">{t("sender")}</TableHead>
//                 <TableHead>{t("beneficiaryType")}</TableHead>
//                 <TableHead>{t("requestType")}</TableHead>
//                 <TableHead>{t("projectIdea")}</TableHead>
//                 <TableHead className="w-[200px]">{t("inquiry")}</TableHead>
//                 <TableHead className="w-[180px]">{t("received")}</TableHead>
//                 <TableHead className="w-[100px] text-right">{tGeneral("actions")}</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {messages.length > 0 ? (
//                 messages.map((message) => (
//                   <TableRow key={message.id}>
//                     <TableCell>
//                       <div className="font-medium">{message.name}</div>
//                       <div className="text-sm text-muted-foreground">
//                         {message.email}
//                       </div>
//                     </TableCell>
//                     <TableCell>{message.beneficiaryType}</TableCell>
//                     <TableCell>{message.requestType}</TableCell>
//                     <TableCell className="max-w-[400px]">
//                       {truncateText(message.message, 20)}
//                       {message.message && message.message.length > 20 && (
//                         <Button
//                           variant="link"
//                           onClick={() => handleViewFullMessage(t("projectIdea"), message.message)}
//                           className="p-0 h-auto align-baseline ml-2"
//                         >
//                           {t("readMore")}
//                         </Button>
//                       )}
//                     </TableCell>
//                     <TableCell className="max-w-[400px] truncate">
//                       {message.inquiry}
//                     </TableCell>
//                     <TableCell>
//                       {format(new Date(message.submittedAt), "PPP p")}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-2">
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleReplyClick(message)}
//                           aria-label={t("reply")}
//                         >
//                           <Reply className="h-4 w-4" />
//                         </Button>
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button variant="ghost" size="icon" aria-label={tGeneral("deleteMessage", { item: message.name })}>
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>{tGeneral("areYouSure")}</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 {tGeneral("deleteConfirmation", { item: t("item") })}
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>{tGeneral("cancel")}</AlertDialogCancel>
//                               <AlertDialogAction onClick={() => handleDelete(message.id)}>
//                                 {tGeneral("delete")}
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={5} className="h-24 text-center">
//                     {isPending ? <Loader2 className="h-8 w-8 animate-spin" /> : tGeneral("noItemsFound", { item: t("item") })}
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//           {hasMore && (
//             <div className="text-center mt-4">
//               <Button onClick={fetchMessages} disabled={isPending}>
//                 {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : t("loadMore")}
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//       {/* Dialog to display the full message content */}
//       <Dialog open={isFullMessageDialogOpen} onOpenChange={setIsFullMessageDialogOpen}>
//         <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{fullMessageContent.title}</DialogTitle>
//           </DialogHeader>
//           <div className="prose dark:prose-invert max-w-none">
//             <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">{fullMessageContent.content}</pre>
//           </div>
//         </DialogContent>
//       </Dialog>
//        {/* Reply Dialog */}
//        <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
//         <DialogContent className="sm:max-w-xl">
//           <DialogHeader>
//             <DialogTitle>{t("replyToMessage")}</DialogTitle>
//             <DialogDescription>
//               {t("replyToMessageDesc", { email: replyData.to })}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label>{t("recipient")}</Label>
//               <Input value={replyData.to} disabled />
//             </div>
//              <div className="grid gap-2">
//               <Label>{t("subject")}</Label>
//               <Input
//                 value={replyData.subject}
//                 onChange={(e) => setReplyData(prev => ({ ...prev, subject: e.target.value }))}
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label>{t("originalMessage")}</Label>
//               <Textarea value={replyData.originalMessage} rows={5} readOnly className="resize-none" />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="reply-content">{t("yourReply")}</Label>
//               <Textarea
//                 id="reply-content"
//                 placeholder={t("yourReplyPlaceholder")}
//                 rows={8}
//                 value={replyData.replyContent}
//                 onChange={(e) => setReplyData(prev => ({ ...prev, replyContent: e.target.value }))}
//               />
//             </div>
//           </div>
//           <AlertDialogFooter>
//             <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>{tGeneral("cancel")}</Button>
//             <Button
//               onClick={handleSendReply}
//               disabled={replyData.isSending || replyData.replyContent.length < 5}
//             >
//               {replyData.isSending ? (
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               ) : (
//                 <Send className="h-4 w-4 mr-2" />
//               )}
//               {t("sendReply")}
//             </Button>
//           </AlertDialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { deleteMessageAction, getMessagesAction, sendReplyAction } from "@/app/actions";
import { format } from "date-fns";
import { useEffect, useState, useTransition } from "react";
import type { Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2, Reply, Send } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const MESSAGE_LIMIT = 5;

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [lastVisibleId, setLastVisibleId] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const { toast } = useToast();
  const t = useTranslations("Admin.messagesPage");
  const tGeneral = useTranslations("Admin.general");

  const [isFullMessageDialogOpen, setIsFullMessageDialogOpen] = useState(false);
  const [fullMessageContent, setFullMessageContent] = useState({ title: '', content: '' });
  
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyData, setReplyData] = useState({
    to: '',
    subject: '',
    originalMessage: '',
    replyContent: '',
    isSending: false
  });

  const fetchMessages = () => {
    if (isPending) return;
    startTransition(async () => {
      const result = await getMessagesAction(MESSAGE_LIMIT, lastVisibleId);
      if (result.messages.length > 0) {
        setMessages((prev) => lastVisibleId ? [...prev, ...result.messages] : result.messages);
        setLastVisibleId(result.lastVisibleId);
        if (result.messages.length < MESSAGE_LIMIT) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteMessageAction(id);
      if (result.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        toast({
          title: tGeneral("itemDeleted", { item: t("item") }),
          description: tGeneral("itemDeletedDesc", { item: t("item") }),
        });
      } else {
        toast({
          title: tGeneral("error"),
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleViewFullMessage = (title: string, content: string) => {
    setFullMessageContent({ title, content });
    setIsFullMessageDialogOpen(true);
  };
  
  const handleReplyClick = (message: Message) => {
    const originalMessage = `Beneficiary Type: ${message.beneficiaryType}\nRequest Type: ${message.requestType}\n\nProject Idea:\n${message.message}\n\nInquiry:\n${message.inquiry}`;
    setReplyData({
      to: message.email,
      subject: `Re: Your inquiry from TechVision website`,
      originalMessage,
      replyContent: '',
      isSending: false
    });
    setIsReplyDialogOpen(true);
  };

  const handleSendReply = async () => {
    setReplyData(prev => ({ ...prev, isSending: true }));
    const result = await sendReplyAction({
      to: replyData.to,
      subject: replyData.subject,
      body: replyData.replyContent,
    });
    if (result.success) {
      toast({
        title: t("replySentTitle"),
        description: t("replySentDesc"),
      });
      setIsReplyDialogOpen(false);
    } else {
      toast({
        title: tGeneral("error"),
        description: result.message,
        variant: "destructive",
      });
    }
    setReplyData(prev => ({ ...prev, isSending: false }));
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };
  
  const renderSkeletonRows = () => {
    return (
      <>
        {Array.from({ length: MESSAGE_LIMIT }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32 mt-1" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-12 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("inboxTitle")}</CardTitle>
          <CardDescription>
            {t("inboxDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">{t("sender")}</TableHead>
                <TableHead>{t("beneficiaryType")}</TableHead>
                <TableHead>{t("requestType")}</TableHead>
                <TableHead>{t("projectIdea")}</TableHead>
                <TableHead className="w-[200px]">{t("inquiry")}</TableHead>
                <TableHead className="w-[180px]">{t("received")}</TableHead>
                <TableHead className="w-[100px] text-right">{tGeneral("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending && messages.length === 0 ? (
                renderSkeletonRows()
              ) : messages.length > 0 ? (
                messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <div className="font-medium">{message.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {message.email}
                      </div>
                    </TableCell>
                    <TableCell>{message.beneficiaryType}</TableCell>
                    <TableCell>{message.requestType}</TableCell>
                    <TableCell className="max-w-[400px]">
                      {truncateText(message.message, 20)}
                      {message.message && message.message.length > 20 && (
                        <Button
                          variant="link"
                          onClick={() => handleViewFullMessage(t("projectIdea"), message.message)}
                          className="p-0 h-auto align-baseline ml-2"
                        >
                          {t("readMore")}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[400px] truncate">
                      {message.inquiry}
                    </TableCell>
                    <TableCell>
                      {format(new Date(message.submittedAt), "PPP p")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReplyClick(message)}
                          aria-label={t("reply")}
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={tGeneral("deleteMessage", { item: message.name })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{tGeneral("areYouSure")}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {tGeneral("deleteConfirmation", { item: t("item") })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{tGeneral("cancel")}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(message.id)}>
                                {tGeneral("delete")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {tGeneral("noItemsFound", { item: t("item") })}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {hasMore && (
            <div className="text-center mt-4">
              <Button onClick={fetchMessages} disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : t("loadMore")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Dialog to display the full message content */}
      <Dialog open={isFullMessageDialogOpen} onOpenChange={setIsFullMessageDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{fullMessageContent.title}</DialogTitle>
          </DialogHeader>
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">{fullMessageContent.content}</pre>
          </div>
        </DialogContent>
      </Dialog>
       {/* Reply Dialog */}
       <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{t("replyToMessage")}</DialogTitle>
            <DialogDescription>
              {t("replyToMessageDesc", { email: replyData.to })}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{t("recipient")}</Label>
              <Input value={replyData.to} disabled />
            </div>
             <div className="grid gap-2">
              <Label>{t("subject")}</Label>
              <Input
                value={replyData.subject}
                onChange={(e) => setReplyData(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t("originalMessage")}</Label>
              <Textarea value={replyData.originalMessage} rows={5} readOnly className="resize-none" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reply-content">{t("yourReply")}</Label>
              <Textarea
                id="reply-content"
                placeholder={t("yourReplyPlaceholder")}
                rows={8}
                value={replyData.replyContent}
                onChange={(e) => setReplyData(prev => ({ ...prev, replyContent: e.target.value }))}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>{tGeneral("cancel")}</Button>
            <Button
              onClick={handleSendReply}
              disabled={replyData.isSending || replyData.replyContent.length < 5}
            >
              {replyData.isSending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {t("sendReply")}
            </Button>
          </AlertDialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}