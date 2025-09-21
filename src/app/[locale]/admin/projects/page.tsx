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
import { deleteProjectAction, getProjectsAction } from "@/app/actions";
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
import type { Project } from "@/lib/types";
import { ProjectForm } from "@/components/admin/ProjectForm";
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


export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const t = useTranslations("Admin.projectsPage");
  const tGeneral = useTranslations("Admin.general");


  const fetchProjects = () => {
    startTransition(async () => {
      const fetchedProjects = await getProjectsAction();
      setProjects(fetchedProjects);
    });
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddClick = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteProjectAction(id);
      if (result.success) {
        fetchProjects();
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
    fetchProjects();
    setIsFormOpen(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Button onClick={handleAddClick} aria-label={t("addProject")} className="flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          {t("addProject")}
        </Button>
      </div>

      <ProjectForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        project={selectedProject}
        onSubmit={onFormSubmit}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("projectsList")}</CardTitle>
          <CardDescription>
            {t("projectsListDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">{t("image")}</span>
                </TableHead>
                <TableHead>{tGeneral("title")}</TableHead>
                <TableHead>{tGeneral("category")}</TableHead>
                <TableHead className="text-right">{tGeneral("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-16 w-16 rounded-md" />
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={project.title}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={project.image}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {project.title}
                    </TableCell>
                    <TableCell>{project.category}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditClick(project)}>
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
                                <AlertDialogAction onClick={() => handleDelete(project.id?.toString())}>
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
