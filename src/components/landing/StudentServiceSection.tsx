"use client";

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Code, Lightbulb, GraduationCap, Zap, BookOpen } from 'lucide-react';
import { FadeIn } from '@/components/ui/animations';

export default function StudentServiceSection() {
    const t = useTranslations('StudentServiceSection');

    const services = [
        {
            icon: Code,
            title: t('services.codeReview.title'),
            description: t('services.codeReview.description')
        },
        {
            icon: GraduationCap,
            title: t('services.graduationProjects.title'),
            description: t('services.graduationProjects.description')
        },
        {
            icon: Lightbulb,
            title: t('services.projectIdeas.title'),
            description: t('services.projectIdeas.description')
        },
        {
            icon: Zap,
            title: t('services.problemSolving.title'),
            description: t('services.problemSolving.description')
        },
        {
            icon: BookOpen,
            title: t('services.practicalExamples.title'),
            description: t('services.practicalExamples.description')
        },
    ];

    return (
        <section id="student-service" className="bg-muted/50 py-10 md:py-16">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <FadeIn>
                        <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">
                            {t('title')}
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
                            {t('subtitle')}
                        </p>
                    </FadeIn>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <FadeIn key={index} delay={index * 0.2}>
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <service.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-semibold font-headline">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {service.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </FadeIn>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="#contact">
                        <Button size="lg">
                            {t('ctaButton')}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}