"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Send, Sparkles, Lightbulb } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useContactForm } from "@/hooks/useContactForm";
import { useTranslations } from "next-intl";

// We re-confirm that the component expects the 'contactFormLogic' as a prop
interface ContactFormUIProps {
    contactFormLogic: ReturnType<typeof useContactForm>;
}

export function ContactFormUI({ contactFormLogic }: ContactFormUIProps) {
    const t = useTranslations("ContactSection");

    // Destructure everything from the prop passed by the parent component
    const {
        form,
        locale,
        contactMethods,
        selectedMethod,
        isProjectMode,
        showContactValueField,
        availableRequestTypes,
        isSubmitting,
        isGettingSuggestions,
        isGeneratingProjectIdea,
        setValue,
        onSubmit,
        handleContactMethodChange,
        getAISuggestions,
        getStructuredProjectIdea
    } = contactFormLogic;

    const { register, handleSubmit, formState: { errors }, watch } = form;

    const watchedMessage = watch("message");
    const watchedInquiry = watch("projectIdea");

    return (
        <Card>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <RadioGroup
                        defaultValue="project"
                        className="grid grid-cols-2 gap-4"
                        onValueChange={(value: "general" | "project") => setValue("formType", value, { shouldValidate: true })}
                        value={watch("formType")}
                    >
                        <div>
                            <RadioGroupItem value="general" id="r-general" className="peer sr-only" />
                            <Label
                                htmlFor="r-general"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                {t('formTypeGeneral')}
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="project" id="r-project" className="peer sr-only" />
                            <Label
                                htmlFor="r-project"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                {t('formTypeProject')}
                            </Label>
                        </div>
                    </RadioGroup>

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
                            {showContactValueField && selectedMethod && (
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
                                <Select onValueChange={(value) => setValue("requestType", value, { shouldValidate: true })} value={watch("requestType")} disabled={availableRequestTypes.length === 0}>
                                    <SelectTrigger><SelectValue placeholder={t('requestTypePlaceholder')} /></SelectTrigger>
                                    <SelectContent>
                                        {availableRequestTypes.map((type) => (
                                            <SelectItem key={type} value={type}>{t(`requestTypeOptions.${type}`)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.requestType && <p className="text-sm text-red-500 mt-1">{errors.requestType.message}</p>}
                            </div>
                        </div>
                    )}

                    {/* ========= START: UI TEXT CHANGES ========= */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            {/* Change label to 'Description' in project mode */}
                            <Label htmlFor="message">{isProjectMode ? t('descriptionLabel') : t('messageLabel_general')}</Label>
                            {isProjectMode && (
                                <Button type="button" variant="outline" onClick={getStructuredProjectIdea} disabled={isGeneratingProjectIdea || !watchedMessage || watchedMessage.length < 20} className="px-3 h-8 text-xs">
                                    {isGeneratingProjectIdea ? <LoadingSpinner size="sm" /> :
                                        <div className="flex items-center gap-1.5">
                                            <Lightbulb className="w-3 h-3" />
                                            <span>AI</span>
                                        </div>
                                    }
                                </Button>
                            )}
                        </div>
                        {/* Change placeholder to 'Description' placeholder */}
                        <Textarea id="message" {...register("message")} placeholder={isProjectMode ? t('descriptionPlaceholder') : t('messagePlaceholder_general')} rows={6} className={errors.message ? "border-red-500" : ""} />
                        {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message?.message}</p>}
                    </div>

                    {isProjectMode && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                {/* Change label to 'Subject' */}
                                <Label htmlFor="projectIdea">{t('subjectLabel')}</Label>
                                <Button type="button" variant="outline" onClick={getAISuggestions} disabled={isGettingSuggestions || !watchedInquiry || watchedInquiry.length < 10} className="px-3 h-8 text-xs">
                                    {isGettingSuggestions ? <LoadingSpinner size="sm" /> :
                                        <div className="flex items-center gap-1.5">
                                            <Sparkles className="w-3 h-3" />
                                            <span>AI</span>
                                        </div>
                                    }
                                </Button>
                            </div>
                            {/* Change placeholder to 'Subject' placeholder */}
                            <Input id="projectIdea" {...register("projectIdea")} placeholder={t('subjectPlaceholder')} className={errors.projectIdea ? "border-red-500" : ""} />
                            {errors.projectIdea && <p className="text-sm text-red-500 mt-1">{errors.projectIdea.message}</p>}
                        </div>
                    )}
                    {/* ========= END: UI TEXT CHANGES ========= */}

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        {t('sendMessage')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

