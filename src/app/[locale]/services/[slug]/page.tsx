import { getServiceBySlugAction } from "@/app/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { CheckCircle2 } from "lucide-react";
import CtaSection from "@/components/landing/CtaSection";
import type { BilingualContent, Service } from "@/lib/types";
import { InteractiveParticles } from "@/components/ui/interactive-particles";


interface ServicePageProps {
    params: {
        slug: string;
        locale: "en" | "ar";
    };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
    const { slug, locale } = await params;
    const service = await getServiceBySlugAction(slug);
    if (!service) return { title: "Service Not Found" };

    const title = service.title?.[locale] || "Service Details";
    const description = service.description?.[locale] || "Learn more about our service.";

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [{ url: service.heroImage || "/image/placeholder.svg" }],
        },
    };
}

const BilingualRenderer = ({ content, locale, fallback = '' }: { content?: BilingualContent, locale: "en" | "ar", fallback?: string }) => {
    return <>{content?.[locale] || fallback}</>;
}

export default async function ServicePage({ params }: ServicePageProps) {
    const { slug, locale } = await params;
    const t = await getTranslations('ServicePage');
    const service = await getServiceBySlugAction(slug);

    if (!service) {
        notFound();
    }

    const safeTitle = service.title?.[locale] || (service as any).title || "Service Title";
    const safeDescription = service.description?.[locale] || (service as any).description || "Service description.";
    const safeDetailedContent = service.detailedContent?.[locale] || safeDescription;

    return (
        <div className="relative bg-background text-foreground overflow-hidden">
            <InteractiveParticles />
            <div className="relative z-10">
                <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
                    {service.heroImage && (
                        <Image
                            src={service.heroImage}
                            alt={safeTitle}
                            fill
                            className="object-cover z-0"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10" />
                    <div className="relative z-20 container mx-auto px-4">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-headline">
                            {safeTitle}
                        </h1>
                        <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-white/90">
                            {safeDescription}
                        </p>
                    </div>
                </section>
                <section className="py-16 lg:py-24">
                    <div className="container mx-auto px-4">
                        <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto"
                            dangerouslySetInnerHTML={{ __html: safeDetailedContent }}
                        />
                    </div>
                </section>
                {service.features && service.features.length > 0 && (
                    <section className="py-16 lg:py-24 bg-secondary/50">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('featuresTitle')}</h2>
                                <p className="mt-4 text-lg text-muted-foreground">{t('featuresSubtitle')}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {service.features.map((feature, index) => (
                                    <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="bg-primary text-primary-foreground p-3 rounded-full">
                                                <CheckCircle2 className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-xl font-semibold font-headline">
                                                <BilingualRenderer content={feature.title} locale={locale} />
                                            </h3>
                                        </div>
                                        <p className="text-muted-foreground">
                                            <BilingualRenderer content={feature.description} locale={locale} />
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <CtaSection />
            </div>
        </div>
    );
}
