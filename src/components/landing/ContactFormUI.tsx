"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Send, Sparkles, Lightbulb } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useContactForm } from "@/hooks/useContactForm";
import { useTranslations } from "next-intl";

interface ContactFormUIProps {
    isProjectMode: boolean;
    setIsProjectMode: Dispatch<SetStateAction<boolean>>;
    // The parent should pass the hook instance so dialogs and UI share state
    contactFormLogic: ReturnType<typeof useContactForm>;
}

export function ContactFormUI({ isProjectMode, setIsProjectMode, contactFormLogic }: ContactFormUIProps) {
    const t = useTranslations("ContactSection");

    // Destructure everything needed from the passed hook instance
    const { form, locale, contactMethods, selectedMethod, isSubmitting, isGettingSuggestions, isGeneratingProjectIdea, setValue, onSubmit, handleContactMethodChange, getAISuggestions, getStructuredProjectIdea } = contactFormLogic;
    const { register, handleSubmit, formState: { errors }, watch } = form;

    const watchedMessage = watch("message");
    const watchedInquiry = watch("projectIdea");

    return (
        <Card>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center space-x-4 justify-end mb-4">
                        <Label htmlFor="toggle-mode">{t('toggleModeLabel')}</Label>
                        <Switch
                            id="toggle-mode"
                            className="ml-4"
                            checked={isProjectMode}
                            // Update parent mode only (form has its own resolver based on isProjectMode)
                            onCheckedChange={(checked) => {
                                setIsProjectMode(Boolean(checked));
                            }}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">{t('name')}</Label>
                            <Input id="name" {...register("name")} placeholder={t('namePlaceholder')} className={errors.name ? "border-red-500" : ""} />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name?.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="email">{t('emailLabel')}</Label>
                            <Input id="email" type="email" {...register("email")} placeholder={t('emailPlaceholder')} className={errors.email ? "border-red-500" : ""} />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>}
                        </div>
                    </div>

                    {/* [RE-INTEGRATED] Contact Method Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="preferredContactMethod">{t('preferredContactMethod')}</Label>
                            <Select onValueChange={handleContactMethodChange} value={watch("preferredContactMethod")}>
                                <SelectTrigger><SelectValue placeholder={t('preferredContactMethodPlaceholder')} /></SelectTrigger>
                                <SelectContent>
                                    {contactMethods.map((method) => (
                                        <SelectItem key={method.id} value={method.name}>
                                            {locale === 'ar' ? method.label_ar : method.label_en}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.preferredContactMethod && <p className="text-sm text-red-500 mt-1">{errors.preferredContactMethod?.message}</p>}
                        </div>
                        <div>
                            {selectedMethod && (
                                <>
                                    <Label htmlFor="contactMethodValue">{locale === 'ar' ? selectedMethod.label_ar : selectedMethod.label_en}</Label>
                                    <Input id="contactMethodValue" type={selectedMethod.inputType} {...register("contactMethodValue")} placeholder={locale === 'ar' ? selectedMethod.placeholder_ar : selectedMethod.placeholder_en} className={errors.contactMethodValue ? "border-red-500" : ""} />
                                    {errors.contactMethodValue && <p className="text-sm text-red-500 mt-1">{errors.contactMethodValue?.message}</p>}
                                </>
                            )}
                        </div>
                    </div>

                    {isProjectMode && (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="beneficiaryType">{t('beneficiaryType')}</Label>
                                <Select onValueChange={(value) => setValue("beneficiaryType", value, { shouldValidate: true })} value={watch("beneficiaryType")}>
                                    <SelectTrigger><SelectValue placeholder={t('beneficiaryTypePlaceholder')} /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">{t('beneficiaryTypeOptions.student')}</SelectItem>
                                        <SelectItem value="individual">{t('beneficiaryTypeOptions.individual')}</SelectItem>
                                        <SelectItem value="company">{t('beneficiaryTypeOptions.company')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.beneficiaryType && <p className="text-sm text-red-500 mt-1">{errors.beneficiaryType.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="requestType">{t('requestType')}</Label>
                                <Select onValueChange={(value) => setValue("requestType", value, { shouldValidate: true })} value={watch("requestType")}>
                                    <SelectTrigger><SelectValue placeholder={t('requestTypePlaceholder')} /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="graduationProject">{t('requestTypeOptions.graduationProject')}</SelectItem>
                                        <SelectItem value="appDevelopment">{t('requestTypeOptions.appDevelopment')}</SelectItem>
                                        <SelectItem value="techConsultation">{t('requestTypeOptions.techConsultation')}</SelectItem>
                                        <SelectItem value="problemSolving">{t('requestTypeOptions.problemSolving')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.requestType && <p className="text-sm text-red-500 mt-1">{errors.requestType.message}</p>}
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="message">{isProjectMode ? t('projectIdeaLabel') : t('messageLabel_general')}</Label>
                            {isProjectMode && (
                                <Button type="button" variant="outline" onClick={getStructuredProjectIdea} disabled={isGeneratingProjectIdea || !watchedMessage || watchedMessage.length < 20} className="px-2">
                                    {isGeneratingProjectIdea ? <LoadingSpinner size="sm" /> : <Lightbulb className="w-4 h-4" />}
                                </Button>
                            )}
                        </div>
                        <Textarea id="message" {...register("message")} placeholder={isProjectMode ? t('projectIdeaPlaceholder') : t('messagePlaceholder_general')} rows={6} className={errors.message ? "border-red-500" : ""} />
                        {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message?.message}</p>}
                    </div>

                    {isProjectMode && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="projectIdea">{t('inquiryLabel')}</Label>
                                <Button type="button" variant="outline" onClick={getAISuggestions} disabled={isGettingSuggestions || !watchedInquiry || watchedInquiry.length < 10} className="px-2">
                                    {isGettingSuggestions ? <LoadingSpinner size="sm" /> : <Sparkles className="w-4 h-4" />}
                                </Button>
                            </div>
                            <Input id="projectIdea" {...register("projectIdea")} placeholder={t('inquiryPlaceholder')} className={errors.projectIdea ? "border-red-500" : ""} />
                            {errors.projectIdea && <p className="text-sm text-red-500 mt-1">{errors.projectIdea.message}</p>}
                        </div>
                    )}

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        {t('sendMessage')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}