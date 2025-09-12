// src/components/admin/ContactMethodsManager.tsx

"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ContactMethod } from "@/lib/types";
import { getContactMethodsAction, deleteContactMethodAction } from "@/app/admin.actions";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { ContactMethodForm } from "./ContactMethodForm";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";


export function ContactMethodsManager() {
    const [methods, setMethods] = useState<ContactMethod[]>([]);
    const [isFetching, startFetchingTransition] = useTransition();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [methodToDelete, setMethodToDelete] = useState<string | null>(null);

    const t = useTranslations("Admin.settingsPage.contactMethods");
    const tGeneral = useTranslations("Admin.general");
    const locale = useLocale();
    const { toast } = useToast();

    const fetchMethods = () => {
        startFetchingTransition(async () => {
            const fetchedMethods = await getContactMethodsAction();
            setMethods(fetchedMethods);
        });
    };

    useEffect(() => {
        fetchMethods();
    }, []);

    const handleAddNew = () => {
        setSelectedMethod(null);
        setIsFormOpen(true);
    };

    const handleEdit = (method: ContactMethod) => {
        setSelectedMethod(method);
        setIsFormOpen(true);
    };

    const openDeleteConfirm = (id: string) => {
        setMethodToDelete(id);
        setIsAlertOpen(true);
    };

    const handleDelete = async () => {
        if (!methodToDelete) return;
        const result = await deleteContactMethodAction(methodToDelete);
        if (result.success) {
            toast({ title: tGeneral("itemDeleted", { item: t("item") }) });
            fetchMethods(); // Refetch data
        } else {
            toast({ title: tGeneral("error"), description: result.message, variant: "destructive" });
        }
        setIsAlertOpen(false);
        setMethodToDelete(null);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t("title")}</CardTitle>
                        <CardDescription>{t("desc")}</CardDescription>
                    </div>
                    <Button onClick={handleAddNew} size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {tGeneral("addNew")}
                    </Button>
                </CardHeader>
                <CardContent>
                    {isFetching ? (
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t("tableHeaderLabel")}</TableHead>
                                        <TableHead>{t("tableHeaderName")}</TableHead>
                                        <TableHead>{t("tableHeaderType")}</TableHead>
                                        <TableHead className="text-right">{t("tableHeaderActions")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {methods.length > 0 ? (
                                        methods.map((method) => (
                                            <TableRow key={method.id}>
                                                <TableCell>{locale === 'ar' ? method.label_ar : method.label_en}</TableCell>
                                                <TableCell><code className="bg-muted px-2 py-1 rounded-md text-sm">{method.name}</code></TableCell>
                                                <TableCell>{method.inputType}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(method)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteConfirm(method.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center">{t("noMethods")}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
            <ContactMethodForm
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                onFormSubmit={fetchMethods}
                initialData={selectedMethod}
            />
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{tGeneral("deleteConfirmTitle")}</AlertDialogTitle>
                        <AlertDialogDescription>{tGeneral("deleteConfirmDesc")}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{tGeneral("cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {tGeneral("delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}