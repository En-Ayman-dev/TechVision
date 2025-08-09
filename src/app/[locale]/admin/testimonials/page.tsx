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
import { deleteTestimonialAction, getTestimonialsAction } from "@/app/actions";
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
import type { Testimonial } from "@/lib/types";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
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

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const { toast } = useToast();
  const t = useTranslations("Admin.testimonialsPage");
  const tGeneral = useTranslations("Admin.general");


  const fetchTestimonials = () => {
    startTransition(async () => {
      const fetchedTestimonials = await getTestimonialsAction();
      setTestimonials(fetchedTestimonials);
    });
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAddClick = () => {
    setSelectedTestimonial(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteTestimonialAction(id);
      if (result.success) {
        fetchTestimonials();
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
    fetchTestimonials();
    setIsFormOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Button onClick={handleAddClick} aria-label={t("addTestimonial")} className="flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          {t("addTestimonial")}
        </Button>
      </div>

      <TestimonialForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        testimonial={selectedTestimonial}
        onSubmit={onFormSubmit}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("testimonialsList")}</CardTitle>
          <CardDescription>
            {t("testimonialsListDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">{tGeneral("image")}</TableHead>
                <TableHead>{t("author")}</TableHead>
                <TableHead>{t("quote")}</TableHead>
                <TableHead className="text-right">{tGeneral("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={testimonial.author}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={testimonial.image}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{testimonial.author}</TableCell>
                    <TableCell className="max-w-[400px] truncate">{testimonial.quote}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditClick(testimonial)}>
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
                                <AlertDialogAction onClick={() => handleDelete(testimonial.id?.toString())}>
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
