"use client";

import { Button } from "@/components/ui/button";
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
import { deleteTeamMemberAction, getTeamAction } from "@/app/actions";
import { PlusCircle, MoreHorizontal, FilePen, Trash2 } from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState, useTransition } from "react";
import type { TeamMember } from "@/lib/types";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { useToast } from "@/hooks/use-toast";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { toast } = useToast();
  const t = useTranslations("Admin.teamPage");
  const tGeneral = useTranslations("Admin.general");


  const fetchTeamMembers = () => {
    startTransition(async () => {
      const fetchedMembers = await getTeamAction();
      setTeamMembers(fetchedMembers);
    });
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleAddClick = () => {
    setSelectedMember(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
     startTransition(async () => {
      const result = await deleteTeamMemberAction(id);
      if (result.success) {
        fetchTeamMembers();
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
  }

  const onFormSubmit = () => {
    fetchTeamMembers();
    setIsFormOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Button onClick={handleAddClick} aria-label={t("addMember")} className="flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          {t("addMember")}
        </Button>
      </div>
      
      <TeamMemberForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        member={selectedMember}
        onSubmit={onFormSubmit}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("teamList")}</CardTitle>
          <CardDescription>
            {t("teamListDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">{tGeneral("image")}</span>
                </TableHead>
                <TableHead>{tGeneral("name")}</TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead className="text-right">{tGeneral("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                 Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="hidden sm:table-cell">
                            <Skeleton className="h-16 w-16 rounded-md" />
                        </TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                 ))
              ) : teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={member.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={member.image}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            aria-label={tGeneral("openMenu")}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{tGeneral("openMenu")}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{tGeneral("actions")}</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditClick(member)}>
                            <FilePen className="mr-2 h-4 w-4" />
                            {tGeneral("edit")}
                          </DropdownMenuItem>
                           <AlertDialog>
                             <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {tGeneral("delete")}
                                </DropdownMenuItem>
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
                                <AlertDialogAction onClick={() => handleDelete(member.id?.toString())}>
                                  {tGeneral("continue")}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
