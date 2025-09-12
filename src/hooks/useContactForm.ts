"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { ContactMethod } from "@/lib/types";
import { getContactMethodsAction } from "@/app/admin.actions";
import { sendMessageAction, getContactSuggestionsAction, generateProjectIdeaAction } from "@/app/contact.actions";
import { useToast } from "@/hooks/use-toast";

// ===== Schemas =====
const baseSchema = {
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    preferredContactMethod: z.string().min(1, "Please select a contact method."),
    contactMethodValue: z.string().min(2, "This field is required."),
};

export const projectSchema = z.object({
    ...baseSchema,
    message: z.string().min(20, "Project idea must be at least 20 characters long."),
    projectIdea: z.string().optional().or(z.literal("")),
    beneficiaryType: z.string().min(1, "Beneficiary type is required."),
    requestType: z.string().min(1, "Request type is required."),
});

export const generalMessageSchema = z.object({
    ...baseSchema,
    message: z.string().min(10, "Message must be at least 10 characters long."),
    projectIdea: z.string().optional().or(z.literal("")),
    beneficiaryType: z.string().optional().or(z.literal("")),
    requestType: z.string().optional().or(z.literal("")),
});

export type ContactFormData =
    | z.infer<typeof projectSchema>
    | z.infer<typeof generalMessageSchema>;

// ===== Hook =====
export function useContactForm(isProjectMode: boolean) {
    const { toast } = useToast();
    const locale = useLocale();
    const t = useTranslations('ContactSection');

    const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(null);
    const [isSubmitting, startSubmission] = useTransition();
    const [isGettingSuggestions, startGettingSuggestions] = useTransition();
    const [isGeneratingProjectIdea, startGeneratingProjectIdea] = useTransition();
    const [isSuggestionsDialogOpen, setIsSuggestionsDialogOpen] = useState(false);
    const [isProjectIdeaDialogOpen, setIsProjectIdeaDialogOpen] = useState(false);
    const [suggestedFaqs, setSuggestedFaqs] = useState<string[]>([]);
    const [structuredProjectIdea, setStructuredProjectIdea] = useState<string>("");

    const form = useForm<ContactFormData>({
        resolver: zodResolver(isProjectMode ? projectSchema : generalMessageSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
            projectIdea: "",
            beneficiaryType: "",
            requestType: "",
            preferredContactMethod: "",
            contactMethodValue: "",
        },
    });

    const { watch, setValue, reset } = form;

    // Fetch contact methods
    useEffect(() => {
        async function fetchContactMethods() {
            const methods = await getContactMethodsAction();
            setContactMethods(methods);
        }
        fetchContactMethods();
    }, []);

    // Handlers
    const handleContactMethodChange = (value: string) => {
        setValue("preferredContactMethod", value, { shouldValidate: true });
        const newSelectedMethod = contactMethods.find((m) => m.name === value) || null;
        setSelectedMethod(newSelectedMethod);
        setValue("contactMethodValue", "", { shouldValidate: true });
    };

    const onSubmit = async (data: ContactFormData) => {
        startSubmission(async () => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, val]) => {
                if (val) formData.append(key, val.toString());
            });

            const result = await sendMessageAction(formData);
            if (result.success) {
                toast({ title: t('toast.successTitle'), description: t('toast.successDescription') });
                reset();
                setSelectedMethod(null);
            } else {
                toast({
                    title: t('toast.errorTitle'),
                    description: result.message || t('toast.errorDescription'),
                    variant: "destructive",
                });
            }
        });
    };

    const getAISuggestions = () => {
        const inputForSuggestions = isProjectMode ? watch("projectIdea") : watch("message");
        if (!inputForSuggestions || inputForSuggestions.length < 10) {
            toast({ title: t('toast.aiWarningTitle'), description: t('toast.aiWarningDescription'), variant: "destructive" });
            return;
        }
        startGettingSuggestions(async () => {
            const result = await getContactSuggestionsAction(inputForSuggestions);
            if (result.success && result.suggestions) {
                setSuggestedFaqs(result.suggestions);
                setIsSuggestionsDialogOpen(true);
            } else {
                toast({ title: t('toast.aiErrorTitle'), description: result.message || t('toast.aiErrorDescription'), variant: "destructive" });
            }
        });
    };

    const getStructuredProjectIdea = () => {
        const msg = watch("message");
        if (!isProjectMode || !msg || msg.length < 20) {
            toast({
                title: t('toast.ideaWarningTitle'),
                description: t('toast.ideaWarningDescription'),
                variant: "destructive",
            });
            return;
        }
        startGeneratingProjectIdea(async () => {
            const result = await generateProjectIdeaAction(msg);
            if (result.success && result.structuredIdea) {
                setStructuredProjectIdea(result.structuredIdea);
                setIsProjectIdeaDialogOpen(true);
            } else {
                toast({
                    title: t('toast.ideaErrorTitle'),
                    description: result.message || t('toast.ideaErrorDescription'),
                    variant: "destructive"
                });
            }
        });
    };

    return {
        form,
        locale,
        contactMethods,
        selectedMethod,
        handleContactMethodChange,
        onSubmit,
        getAISuggestions,
        getStructuredProjectIdea,
        suggestedFaqs,
        structuredProjectIdea,
        isSubmitting,
        isGettingSuggestions,
        isGeneratingProjectIdea,
        isSuggestionsDialogOpen,
        setIsSuggestionsDialogOpen,
        isProjectIdeaDialogOpen,
        setIsProjectIdeaDialogOpen,
        setValue,
    };
}
