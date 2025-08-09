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
import { deletePartnerAction, getPartnersAction } from "@/app/actions";
import { PlusCircle, MoreHorizontal, FilePen, Trash2, Globe, CircuitBoard, Rocket, Bot, Building } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState, useTransition } from "react";
import type { Partner } from "@/lib/types";
import { PartnerForm } from "@/components/admin/PartnerForm";
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

const iconMap: { [key: string]: React.ElementType } = {
  Globe,
  CircuitBoard,
  Rocket,
  Bot,
  Building,
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const { toast } = useToast();
  const t = useTranslations("Admin.partnersPage");
  const tGeneral = useTranslations("Admin.general");


  const fetchPartners = () => {
    startTransition(async () => {
      const fetchedPartners = await getPartnersAction();
      setPartners(fetchedPartners);
    });
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAddClick = () => {
    setSelectedPartner(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deletePartnerAction(id);
      if (result.success) {
        fetchPartners();
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

  const onFormSubmit = () => {
    fetchPartners();
    setIsFormOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Button onClick={handleAddClick}  aria-label={t("addPartner")} >
          <PlusCircle className="mr-2 h-5 w-5" />
          {t("addPartner")}
        </Button>
      </div>

      <PartnerForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        partner={selectedPartner}
        onSubmit={onFormSubmit}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("partnersList")}</CardTitle>
          <CardDescription>
            {t("partnersListDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">{t("logo")}</TableHead>
                <TableHead>{tGeneral("name")}</TableHead>
                <TableHead className="text-right">{tGeneral("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-6" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : partners.length > 0 ? (
                partners.map((partner) => {
                  const IconComponent = iconMap[partner.logo] || Globe;
                  return (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <IconComponent className="h-5 w-5" />
                      </TableCell>
                      <TableCell className="font-medium">{partner.name}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost" aria-label={tGeneral("openMenu")}>
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{tGeneral("openMenu")}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{tGeneral("actions")}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(partner)}>
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
                                  <AlertDialogAction onClick={() => handleDelete(partner.id!)}>
                                    {tGeneral("continue")}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
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
