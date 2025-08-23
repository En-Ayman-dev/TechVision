"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getTeamAction } from '@/app/actions';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import type { TeamMember } from "@/lib/types";


// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


export default function TeamSection() {
  const t = useTranslations('TeamSection');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const fetchedMembers = await getTeamAction();
      setTeamMembers(fetchedMembers);
      setIsLoading(false);
    };
    fetchTeamMembers();
  }, []);

  return (
    <section id="team" className="bg-secondary/50">
      <div className="container mx-auto px-4 py-10">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
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
          className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={containerVariants}
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-[250px] rounded-lg" />
            ))
          ) : (
            teamMembers.map((member) => (
              <motion.div key={member.id} variants={itemVariants}>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={150}
                      height={150}
                      className="rounded-full mx-auto mb-4"
                      data-ai-hint={member.dataAiHint}
                    />
                    <h3 className="text-lg font-semibold font-headline">{member.name}</h3>
                    <p className="text-primary">{member.role}</p>
                    <div className="mt-4 flex justify-center gap-4">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={member.social.twitter || '#'} aria-label={`${member.name}'s Twitter`}>
                          <Twitter className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={member.social.linkedin || '#'} aria-label={`${member.name}'s LinkedIn`}>
                          <Linkedin className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}