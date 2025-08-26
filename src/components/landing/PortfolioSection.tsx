"use client";

import { motion, useScroll, useTransform, Variants, useMotionValue, useSpring } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import React, { useRef } from "react";
import { InteractiveParticles } from "@/components/ui/interactive-particles";
import { ProjectDetailsDialog } from "./ProjectDetailsDialog"; // <-- 1. استيراد المكون الجديد
import { Eye } from "lucide-react"; // <-- 2. استيراد أيقونة العين

interface PortfolioSectionProps {
    projects: Project[];
}

// Animation variants with explicit TypeScript type
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

// Reusable AnimatedCard component, adapted for the portfolio
const AnimatedCard = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null);

    // Scroll Parallax Effect
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    // Mouse 3D Tilt Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const mouseXSpring = useSpring(mouseX, { stiffness: 80, damping: 20 });
    const mouseYSpring = useSpring(mouseY, { stiffness: 80, damping: 20 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            style={{ y }}
            className="w-full h-full"
            variants={itemVariants}
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </motion.div>
    );
}


export default function PortfolioSection({ projects }: PortfolioSectionProps) {
    const t = useTranslations("PortfolioSection");
    const isLoading = projects.length === 0;

    return (
        <section id="projects-section" className="relative bg-background overflow-hidden">
            <InteractiveParticles />
            <div className="container py-16 lg:py-24 relative z-10">
                <motion.div
                    className="mb-12 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={containerVariants}
                >
                    <motion.h2
                        className="text-3xl font-bold md:text-4xl"
                        variants={itemVariants}
                    >
                        {t("title")}
                    </motion.h2>
                    <motion.p
                        className="mt-4 text-lg text-muted-foreground"
                        variants={itemVariants}
                    >
                        {t("subtitle")}
                    </motion.p>
                </motion.div>
                <motion.div
                    className="grid gap-12 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                >
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-96 rounded-xl bg-white/5" />
                        ))
                    ) : (
                        projects.map((project) => (
                            <AnimatedCard key={project.id}>
                                {/* --- 3. Wrapping the Card with the Dialog --- */}
                                <ProjectDetailsDialog project={project}>
                                    <Card
                                        className="flex h-full flex-col overflow-hidden transition-all duration-300 ease-in-out
                                                   bg-background/40 hover:bg-background/60 border-white/10
                                                   backdrop-blur-md group cursor-pointer"
                                        style={{ transformStyle: "preserve-3d", transform: "translateZ(40px)" }}
                                    >
                                        <div className="overflow-hidden relative">
                                            <Image
                                                src={project.image || "/image/placeholder.svg"}
                                                alt={project.title}
                                                width={600}
                                                height={400}
                                                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                priority
                                                style={{ transform: "translateZ(20px)" }}
                                            />
                                            {/* --- 4. Adding a hover overlay --- */}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Eye className="h-10 w-10 text-white" />
                                            </div>
                                        </div>
                                        <CardContent className="flex flex-grow flex-col p-6">
                                            <h3 className="text-xl font-semibold" style={{ transform: "translateZ(15px)" }}>
                                                {project.title}
                                            </h3>
                                            <p className="mt-2 text-muted-foreground" style={{ transform: "translateZ(10px)" }}>
                                                {project.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </ProjectDetailsDialog>
                            </AnimatedCard>
                        )))}
                </motion.div>
            </div>
        </section>
    );
}
