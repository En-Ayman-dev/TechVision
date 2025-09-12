"use client";

import { useTranslations } from "next-intl";
import { useContactForm } from "@/hooks/useContactForm";
import { ContactFormUI } from "./ContactFormUI";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export function ContactSectionEnhanced() {
    const t = useTranslations('ContactSection');

    // The hook is called ONCE here in the parent component.
    // This makes it the single source of truth for the form and its dialogs.
    const contactFormLogic = useContactForm();

    const {
        isProjectMode, // We get this from the hook now
        suggestedFaqs,
        structuredProjectIdea,
        isSuggestionsDialogOpen, // Also from the hook
        isProjectIdeaDialogOpen,  // Also from the hook
        setIsSuggestionsDialogOpen,
        setIsProjectIdeaDialogOpen,
        setValue,
    } = contactFormLogic;

    // Local handlers that operate on the shared hook state
    const handleSelectSuggestion = (faq: string) => {
        // When a suggestion is selected, insert it into the appropriate field
        if (isProjectMode) {
            setValue("projectIdea", faq, { shouldValidate: true });
        } else {
            setValue("message", faq, { shouldValidate: true });
        }
        setIsSuggestionsDialogOpen(false);
    };

    const handleAcceptProjectIdea = () => {
        // Put the structured idea into the projectIdea field and close dialog
        // Note: The original logic put this into projectIdea, which seems correct.
        setValue("message", structuredProjectIdea, { shouldValidate: true });
        setIsProjectIdeaDialogOpen(false);
    };

    return (
        <section id="contact" className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {/*
                                Correction: We now pass the entire logic object as a prop.
                                ContactFormUI no longer has its own state.
                             */}
                            <ContactFormUI contactFormLogic={contactFormLogic} />
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-6 text-lg">{t("getInTouch")}</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-primary mt-0.5" /><div><p className="font-medium">{t("email")}</p><a href="mailto:ayman.alzhabi.dev@gmail.com" className="text-muted-foreground text-sm hover:underline">ayman.alzhabi.dev@gmail.com</a></div></div>
                                        <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-primary mt-0.5" /><div><p className="font-medium">{t("phone")}</p><a href="https://wa.me/967774998429" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:underline">+967 774 998 429</a></div></div>
                                        <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary mt-0.5" /><div><p className="font-medium">{t("address")}</p><p className="text-muted-foreground text-sm">{t("addressLine1")}<br />{t("addressLine2")}</p></div></div>
                                        <div className="flex items-start gap-3"><Clock className="w-5 h-5 text-primary mt-0.5" /><div><p className="font-medium">{t("businessHours")}</p><p className="text-muted-foreground text-sm">{t("mondayFriday")}<br />{t("saturday")}<br />{t("sunday")}</p></div></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-4">{t("whyChooseUs")}</h3>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li>• {t("reason1")}</li>
                                        <li>• {t("reason2")}</li>
                                        <li>• {t("reason3")}</li>
                                        <li>• {t("reason4")}</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Dialogs now correctly use the shared state from the parent */}
            <Dialog open={isSuggestionsDialogOpen} onOpenChange={setIsSuggestionsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('toast.aiSuggestionsTitle')}</DialogTitle>
                        <DialogDescription>{t('toast.aiSuggestionsDescription')}</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col space-y-2">
                        {suggestedFaqs.map((faq: string, index: number) => (
                            <Button key={index} variant="outline" className="justify-start h-auto whitespace-normal" onClick={() => handleSelectSuggestion(faq)}>
                                {faq}
                            </Button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={isProjectIdeaDialogOpen} onOpenChange={setIsProjectIdeaDialogOpen}>
                <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{t('toast.structuredProjectIdeaTitle')}</DialogTitle>
                        <DialogDescription>{t('toast.structuredProjectIdeaDescription')}</DialogDescription>
                    </DialogHeader>
                    <div className="prose dark:prose-invert max-w-none mb-4">
                        <ReactMarkdown>{structuredProjectIdea}</ReactMarkdown>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleAcceptProjectIdea}>{t('acceptIdea')}</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}
