"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/types";
import Image from "next/image";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ProjectDetailsDialogProps {
    project: Project;
    children: React.ReactNode; // This will be the card that triggers the dialog
}

export function ProjectDetailsDialog({ project, children }: ProjectDetailsDialogProps) {
    const t = useTranslations("PortfolioSection.Dialog");

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            {/* --- 1. The Fix is applied here --- */}
            <DialogContent className="sm:max-w-3xl bg-background/80 backdrop-blur-md border-white/10 text-foreground grid-rows-[auto_1fr_auto] max-h-[90vh] flex flex-col">

                {/* Header Section (Non-scrollable) */}
                <DialogHeader className="space-y-4 flex-shrink-0">
                    <div className="relative w-full h-56 md:h-72 rounded-lg overflow-hidden border border-white/10">
                        <Image
                            src={project.image || "/image/placeholder.svg"}
                            alt={project.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <DialogTitle className="text-3xl font-bold font-headline tracking-tight">{project.title}</DialogTitle>
                </DialogHeader>

                {/* --- 2. Scrollable Content Area --- */}
                <div className="overflow-y-auto pr-4 my-4 flex-grow">
                    <DialogDescription className="text-base text-muted-foreground">
                        {/* Use the detailed description if it exists, otherwise fall back to the short one */}
                        {project.detailedDescription || project.description}
                    </DialogDescription>
                </div>

                {/* Footer Section (Non-scrollable) */}
                {(project.liveUrl || project.githubUrl) && (
                    <DialogFooter className="sm:justify-start gap-3 flex-shrink-0">
                        {project.liveUrl && (
                            <Button asChild className="flex-1 sm:flex-none">
                                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    {t('livePreview')}
                                </Link>
                            </Button>
                        )}
                        {project.githubUrl && (
                            <Button variant="secondary" asChild className="flex-1 sm:flex-none">
                                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                    <Github className="mr-2 h-4 w-4" />
                                    {t('viewSource')}
                                </Link>
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
