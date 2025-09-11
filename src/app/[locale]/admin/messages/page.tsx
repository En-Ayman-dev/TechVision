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
import { deleteMessageAction, getMessagesAction } from "@/app/actions"; // تم إزالة sendReplyAction
import { format } from "date-fns";
import { useEffect, useState, useTransition } from "react";
import type { Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2, Reply } from "lucide-react"; // تم إزالة Send
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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import Link from "next/link"; // للتنقل إلى صفحة الرد الجديدة


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

  // تم حذف جميع حالات ودوائل الرد القديمة (isReplyDialogOpen, handleReplyClick, handleSendReply)

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
                        {/* تم استبدال الزر القديم بـ Link الجديد */}
                        <Link href={`/admin/messages/reply/${message.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t("reply")}
                          >
                            <Reply className="h-4 w-4" />
                          </Button>
                        </Link>
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
      {/* تم حذف الكود الخاص بـ Reply Dialog هنا */}
    </div>
  );
}