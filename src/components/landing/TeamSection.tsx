"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, Variants, useMotionValue, useSpring } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { TeamMember } from "@/lib/types";
import React, { useRef } from "react";
import { InteractiveParticles } from "@/components/ui/interactive-particles";

interface TeamSectionProps {
  teams: TeamMember[];
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

// Reusable AnimatedCard component, adapted for the team section
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


export default function TeamSection({ teams }: TeamSectionProps) {
  const t = useTranslations('TeamSection');
  const isLoading = teams.length === 0;

  return (
    <section id="team" className="relative bg-background overflow-hidden">
      <InteractiveParticles />
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-3xl font-bold tracking-tight font-headline sm:text-4xl"
            variants={itemVariants}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground"
            variants={itemVariants}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>
        <motion.div
          className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={containerVariants}
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-[320px] rounded-xl bg-white/5" />
            ))
          ) : (
            teams.map((team) => (
              <AnimatedCard key={team.id}>
                <Card
                  className="text-center h-full group transition-all duration-300 ease-in-out
                             bg-background/40 hover:bg-background/60 border-white/10
                             backdrop-blur-md"
                  style={{ transformStyle: "preserve-3d", transform: "translateZ(40px)" }}
                >
                  <CardContent className="p-6">
                    <motion.div
                      style={{ transform: "translateZ(30px)" }}
                      className="transition-transform duration-300 group-hover:scale-110"
                    >
                      <Image
                        src={team.image}
                        alt={team.name}
                        width={128}
                        height={128}
                        className="rounded-full mx-auto mb-4 border-4 border-white/10"
                        data-ai-hint={team.dataAiHint}
                      />
                    </motion.div>
                    <h3 className="text-xl font-semibold font-headline" style={{ transform: "translateZ(20px)" }}>{team.name}</h3>
                    <p className="text-primary" style={{ transform: "translateZ(15px)" }}>{team.role}</p>
                    <div className="mt-4 flex justify-center gap-4" style={{ transform: "translateZ(10px)" }}>
                      <Button variant="outline" size="icon" asChild className="bg-transparent border-white/20 hover:bg-white/20">
                        <Link href={team.social.twitter || '#'} aria-label={`${team.name}'s Twitter`}>
                          <Twitter className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild className="bg-transparent border-white/20 hover:bg-white/20">
                        <Link href={team.social.linkedin || '#'} aria-label={`${team.name}'s LinkedIn`}>
                          <Linkedin className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}
