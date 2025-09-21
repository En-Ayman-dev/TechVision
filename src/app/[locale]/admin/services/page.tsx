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
import { deleteServiceAction, getServicesAction } from "@/app/actions";
import { PlusCircle, MoreHorizontal, FilePen, Trash2, Code, Cloud, PenTool, Database, Shield, LineChart } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState, useTransition } from "react";
import type { Service } from "@/lib/types";
import { ServiceForm } from "@/components/admin/ServiceForm";
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
import { useTranslations, useLocale } from "next-intl"; // 1. Import useLocale

const iconMap: { [key: string]: React.ElementType } = {
    Code,
    Cloud,
    PenTool,
    Database,
    Shield,
    LineChart,
};

export default function ServicesPage() {
    const t = useTranslations('Admin.servicesPage');
    const tg = useTranslations('Admin.general');
    const locale = useLocale() as 'en' | 'ar'; // 2. Get the current locale
    const [services, setServices] = useState<Service[]>([]);
    const [isPending, startTransition] = useTransition();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const { toast } = useToast();

    const fetchServices = () => {
        startTransition(async () => {
            const fetchedServices = await getServicesAction();
            setServices(fetchedServices);
        });
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleAddClick = () => {
        setSelectedService(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (service: Service) => {
        setSelectedService(service);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        startTransition(async () => {
            const result = await deleteServiceAction(id);
            if (result.success) {
                fetchServices();
                toast({
                    title: t('serviceDeleted'),
                    description: t('serviceDeletedDesc'),
                });
            } else {
                toast({
                    title: tg('error'),
                    description: result.message,
                    variant: "destructive",
                });
            }
        });
    };

    const onFormSubmit = () => {
        fetchServices();
        setIsFormOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t('manageServices')}</h1>
                <Button onClick={handleAddClick} aria-label={t('addService')} className="flex items-center">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    {t('addService')}
                </Button>
            </div>

            <ServiceForm
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                service={selectedService}
                onSubmit={onFormSubmit}
            />

            <Card>
                <CardHeader>
                    <CardTitle>{t('servicesList')}</CardTitle>
                    <CardDescription>
                        {t('servicesListDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">{tg('icon')}</TableHead>
                                <TableHead>{tg('title')}</TableHead>
                                <TableHead>{tg('description')}</TableHead>
                                <TableHead className="text-right">{tg('actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isPending ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-6 w-6" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : services.length > 0 ? (
                                services.map((service) => {
                                    const IconComponent = iconMap[service.icon] || Code;

                                    // --- 3. The Fix is Here: Safely access bilingual content ---
                                    const title = typeof service.title === 'object' ? service.title?.[locale] : service.title;
                                    let description = typeof service.description === 'object' ? service.description?.[locale] : service.description;
                                    if (description && description.length > 100) {
                                        description = description.substring(0, 100) + '...';
                                    }
                                    // -----------------------------------------------------------

                                    return (
                                        <TableRow key={service.id}>
                                            <TableCell>
                                                <IconComponent className="h-5 w-5" />
                                            </TableCell>
                                            <TableCell className="font-medium">{title}</TableCell>
                                            <TableCell>{description}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost" aria-label={tg('openMenu')}>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">{tg('actions')}</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>{tg('actions')}</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEditClick(service)}>
                                                            <FilePen className="mr-2 h-4 w-4" />
                                                            {tg('edit')}
                                                        </DropdownMenuItem>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    {tg('delete')}
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>{tg('areYouSure')}</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        {tg('deleteConfirmation', { item: t('item') })}
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>{tg('cancel')}</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(service.id)}>
                                                                        {tg('continue')}
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
                                        {t('noServicesFound')}
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
