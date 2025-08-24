
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

interface PortfolioSectionProps {
    projects: Project[];
}

export default function PortfolioSection({ projects }: PortfolioSectionProps) {
    const t = useTranslations("PortfolioSection");
    const isLoading = projects.length === 0;
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // تأخير بسيط بين ظهور كل بطاقة
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section id="projects-section" className="container py-16 lg:py-24">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold md:text-4xl">
                    {t("title")}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    {t("subtitle")}
                </p>
            </div>
            <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
            >
                {isLoading ? (
                    // Use isLoading to show skeleton loaders
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex flex-col items-center justify-center text-center">
                            <Skeleton className="h-12 w-12 rounded-full mb-2" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))
                ) : (
                    projects.map((project) => (
                        <motion.div key={project.id} variants={itemVariants}>
                            <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                                <Image
                                    src={project.image || "/image/placeholder.svg"}
                                    alt={project.title}
                                    width={600}
                                    height={400}
                                    className="h-48 w-full object-cover"
                                />
                                <CardContent className="flex flex-grow flex-col p-6">
                                    <h3 className="text-xl font-semibold">
                                        {project.title}
                                    </h3>
                                    <p className="mt-2 text-muted-foreground">
                                        {project.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )))}
            </motion.div>
        </section>
    );
}