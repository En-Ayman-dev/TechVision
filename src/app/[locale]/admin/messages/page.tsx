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
import { deleteMessageAction, getMessagesAction } from "@/app/actions";
import { format } from "date-fns";
import { useEffect, useState, useTransition } from "react";
import type { Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const t = useTranslations("Admin.messagesPage");
  const tGeneral = useTranslations("Admin.general");


  useEffect(() => {
    startTransition(async () => {
      const fetchedMessages = await getMessagesAction();
      setMessages(fetchedMessages);
    });
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
                <TableHead className="w-[200px]">{t("sender")}</TableHead>
                <TableHead>{t("message")}</TableHead>
                <TableHead className="w-[180px]">{t("received")}</TableHead>
                <TableHead className="w-[100px] text-right">{tGeneral("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                  </TableRow>
                ))
              ) : messages.length > 0 ? (
                messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <div className="font-medium">{message.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {message.email}
                      </div>
                    </TableCell>
                    <TableCell>{message.message}</TableCell>
                    <TableCell>
                      {format(new Date(message.submittedAt), "PPP p")}
                    </TableCell>
                    <TableCell className="text-right">
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {tGeneral("noItemsFound", { item: t("item") })}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
