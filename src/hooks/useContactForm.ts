// "use client";

// import { useEffect, useState, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useLocale, useTranslations } from "next-intl";
// import { ContactMethod } from "@/lib/types";
// import { getContactMethodsAction } from "@/app/admin.actions";
// import { sendMessageAction, getContactSuggestionsAction, generateProjectIdeaAction } from "@/app/contact.actions";
// import { useToast } from "@/hooks/use-toast";

// // ===== Data Structure for Dynamic Selects =====
// const requestTypesByBeneficiary = {
//     student: ["graduationProject", "technicalSupport", "studentService","problemSolving"],
//     individual: ["personalProject", "techConsultation", "problemSolving"],
//     company: ["appDevelopment", "partnership", "businessInquiry"],
// };
// type BeneficiaryType = keyof typeof requestTypesByBeneficiary;


// // ===== Schemas =====
// const createContactSchema = (t: (key: string) => string) => z.object({
//     formType: z.enum(['project', 'general']),
//     name: z.string().min(2, t('validation.nameMin')),
//     email: z.string().email(t('validation.emailInvalid')),
//     preferredContactMethod: z.string().min(1, t('validation.contactMethodRequired')),
//     contactMethodValue: z.string().optional(), 
//     message: z.string(),
//     projectIdea: z.string().optional(),
//     beneficiaryType: z.string().optional(),
//     requestType: z.string().optional(),
// })
// .superRefine((data, ctx) => {
//     // 1. Refine 'message' based on 'formType'
//     if (data.formType === 'project' && data.message.length < 20) {
//         ctx.addIssue({
//             code: z.ZodIssueCode.too_small,
//             minimum: 20,
//             type: "string",
//             inclusive: true,
//             path: ["message"],
//             message: t('validation.projectIdeaMin'),
//         });
//     }
//     if (data.formType === 'general' && data.message.length < 10) {
//         ctx.addIssue({
//             code: z.ZodIssueCode.too_small,
//             minimum: 10,
//             type: "string",
//             inclusive: true,
//             path: ["message"],
//             message: t('validation.messageMin'),
//         });
//     }

//     // 2. Require 'beneficiaryType' and 'requestType' only in project mode
//     if (data.formType === 'project') {
//         if (!data.beneficiaryType || data.beneficiaryType.length < 1) {
//             ctx.addIssue({
//                 code: z.ZodIssueCode.custom,
//                 path: ["beneficiaryType"],
//                 message: t('validation.beneficiaryTypeRequired'),
//             });
//         }
//         if (!data.requestType || data.requestType.length < 1) {
//             ctx.addIssue({
//                 code: z.ZodIssueCode.custom,
//                 path: ["requestType"],
//                 message: t('validation.requestTypeRequired'),
//             });
//         }
//     }

//     // 3. Require 'contactMethodValue' only if the method is NOT 'email'
//     // CORRECTION FOR ISSUE #3: Use 'email' (lowercase) for comparison.
//     if (data.preferredContactMethod && data.preferredContactMethod !== 'email' && (!data.contactMethodValue || data.contactMethodValue.length < 2)) {
//          ctx.addIssue({
//              code: z.ZodIssueCode.custom,
//              path: ["contactMethodValue"],
//              message: t('validation.contactValueRequired'),
//          });
//     }
// });


// export type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

// // ===== Hook =====
// export function useContactForm() {
//     const { toast } = useToast();
//     const locale = useLocale();
//     const t = useTranslations('ContactSection');
//     const contactSchema = createContactSchema(t);

//     const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
//     const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(null);
//     const [availableRequestTypes, setAvailableRequestTypes] = useState<string[]>([]);
//     const [isSubmitting, startSubmission] = useTransition();
//     const [isGettingSuggestions, startGettingSuggestions] = useTransition();
//     const [isGeneratingProjectIdea, startGeneratingProjectIdea] = useTransition();
//     const [isSuggestionsDialogOpen, setIsSuggestionsDialogOpen] = useState(false);
//     const [isProjectIdeaDialogOpen, setIsProjectIdeaDialogOpen] = useState(false);
//     const [suggestedFaqs, setSuggestedFaqs] = useState<string[]>([]);
//     const [structuredProjectIdea, setStructuredProjectIdea] = useState<string>("");

//     const form = useForm<ContactFormData>({
//         resolver: zodResolver(contactSchema),
//         // CORRECTION FOR ISSUE #2: Change validation mode to 'onChange' for real-time feedback.
//         mode: 'onChange',
//         defaultValues: {
//             formType: 'project',
//             name: "",
//             email: "",
//             message: "",
//             projectIdea: "",
//             beneficiaryType: "",
//             requestType: "",
//             preferredContactMethod: "",
//             contactMethodValue: "",
//         },
//     });

//     const { watch, setValue, reset, trigger } = form;

//     const watchedFormType = watch("formType");
//     const isProjectMode = watchedFormType === 'project';
//     const watchedBeneficiaryType = watch("beneficiaryType") as BeneficiaryType;
//     const watchedContactMethod = watch("preferredContactMethod");
//     const watchedEmail = watch("email");

//     // CORRECTION FOR ISSUE #3: Ensure comparison is case-insensitive and correct.
//     const showContactValueField = watchedContactMethod && watchedContactMethod.toLowerCase() !== 'email';

//     // Fetch contact methods
//     useEffect(() => {
//         async function fetchContactMethods() {
//             const methods = await getContactMethodsAction();
//             setContactMethods(methods);
//         }
//         fetchContactMethods();
//     }, []);

//     // EFFECT: Dynamically update available request types based on beneficiary
//     useEffect(() => {
//         if (watchedBeneficiaryType && requestTypesByBeneficiary[watchedBeneficiaryType]) {
//             setAvailableRequestTypes(requestTypesByBeneficiary[watchedBeneficiaryType]);
//         } else {
//             setAvailableRequestTypes([]);
//         }
//         setValue("requestType", "");
//     }, [watchedBeneficiaryType, setValue]);

//     // EFFECT: Re-validate the form when the form type changes
//     useEffect(() => {
//         if (Object.keys(form.formState.errors).length > 0) {
//             trigger();
//         }
//     }, [isProjectMode, trigger, form.formState.errors]);

//     // NEW EFFECT FOR ISSUE #3: Automatically set contact value if method is email.
//     useEffect(() => {
//         if (watchedContactMethod?.toLowerCase() === 'email') {
//             setValue('contactMethodValue', watchedEmail, { shouldValidate: true });
//         }
//     }, [watchedContactMethod, watchedEmail, setValue]);

//     // Handlers
//     const handleContactMethodChange = (value: string) => {
//         setValue("preferredContactMethod", value, { shouldValidate: true });
//         const newSelectedMethod = contactMethods.find((m) => m.name === value) || null;
//         setSelectedMethod(newSelectedMethod);

//         if (newSelectedMethod?.name.toLowerCase() !== 'email') {
//             setValue("contactMethodValue", "", { shouldValidate: true });
//         }
//     };

//     const onSubmit = async (data: ContactFormData) => {
//         startSubmission(async () => {
//             const formData = new FormData();
//             Object.entries(data).forEach(([key, val]) => {
//                 if (val) formData.append(key, val.toString());
//             });

//             formData.append('isProject', (data.formType === 'project').toString());

//             const result = await sendMessageAction(formData);
//             if (result.success) {
//                 toast({ title: t('toast.successTitle'), description: t('toast.successDescription') });
//                 reset();
//                 setSelectedMethod(null);
//             } else {
//                 toast({
//                     title: t('toast.errorTitle'),
//                     description: result.message || t('toast.errorDescription'),
//                     variant: "destructive",
//                 });
//             }
//         });
//     };

//     const getAISuggestions = () => {
//         const inputForSuggestions = isProjectMode ? watch("projectIdea") : watch("message");
//         if (!inputForSuggestions || inputForSuggestions.length < 10) {
//             toast({ title: t('toast.aiWarningTitle'), description: t('toast.aiWarningDescription'), variant: "destructive" });
//             return;
//         }
//         startGettingSuggestions(async () => {
//             const result = await getContactSuggestionsAction(inputForSuggestions);
//             if (result.success && result.suggestions) {
//                 setSuggestedFaqs(result.suggestions);
//                 setIsSuggestionsDialogOpen(true);
//             } else {
//                 toast({ title: t('toast.aiErrorTitle'), description: result.message || t('toast.aiErrorDescription'), variant: "destructive" });
//             }
//         });
//     };

//     const getStructuredProjectIdea = () => {
//         const msg = watch("message");
//         if (!isProjectMode || !msg || msg.length < 20) {
//             toast({
//                 title: t('toast.ideaWarningTitle'),
//                 description: t('toast.ideaWarningDescription'),
//                 variant: "destructive",
//             });
//             return;
//         }
//         startGeneratingProjectIdea(async () => {
//             const result = await generateProjectIdeaAction(msg);
//             if (result.success && result.structuredIdea) {
//                 setStructuredProjectIdea(result.structuredIdea);
//                 setIsProjectIdeaDialogOpen(true);
//             } else {
//                 toast({
//                     title: t('toast.ideaErrorTitle'),
//                     description: result.message || t('toast.ideaErrorDescription'),
//                     variant: "destructive"
//                 });
//             }
//         });
//     };

//     return {
//         form,
//         locale,
//         contactMethods,
//         selectedMethod,
//         isProjectMode,
//         showContactValueField,
//         availableRequestTypes,
//         handleContactMethodChange,
//         onSubmit,
//         getAISuggestions,
//         getStructuredProjectIdea,
//         suggestedFaqs,
//         structuredProjectIdea,
//         isSubmitting,
//         isGettingSuggestions,
//         isGeneratingProjectIdea,
//         isSuggestionsDialogOpen,
//         setIsSuggestionsDialogOpen,
//         isProjectIdeaDialogOpen,
//         setIsProjectIdeaDialogOpen,
//         setValue,
//     };
// }

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

// ===== Data Structure for Dynamic Selects =====
const requestTypesByBeneficiary = {
    student: ["graduationProject", "technicalSupport", "studentService", "problemSolving"],
    individual: ["personalProject", "techConsultation", "problemSolving"],
    company: ["appDevelopment", "partnership", "businessInquiry"],
};
type BeneficiaryType = keyof typeof requestTypesByBeneficiary;


// ===== Schemas =====
const createContactSchema = (t: (key: string) => string) => z.object({
    formType: z.enum(['project', 'general']),
    name: z.string().min(2, t('validation.nameMin')),
    email: z.string().email(t('validation.emailInvalid')),
    preferredContactMethod: z.string().min(1, t('validation.contactMethodRequired')),
    contactMethodValue: z.string().optional(),
    message: z.string(),
    projectIdea: z.string().optional(),
    beneficiaryType: z.string().optional(),
    requestType: z.string().optional(),
})
    .superRefine((data, ctx) => {
        // 1. Refine 'message' based on 'formType'
        if (data.formType === 'project' && data.message.length < 20) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                minimum: 20,
                type: "string",
                inclusive: true,
                path: ["message"],
                message: t('validation.projectIdeaMin'),
            });
        }
        if (data.formType === 'general' && data.message.length < 10) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                minimum: 10,
                type: "string",
                inclusive: true,
                path: ["message"],
                message: t('validation.messageMin'),
            });
        }

        // 2. Require 'beneficiaryType' and 'requestType' only in project mode
        if (data.formType === 'project') {
            if (!data.beneficiaryType || data.beneficiaryType.length < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["beneficiaryType"],
                    message: t('validation.beneficiaryTypeRequired'),
                });
            }
            if (!data.requestType || data.requestType.length < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["requestType"],
                    message: t('validation.requestTypeRequired'),
                });
            }
        }

        // 3. Require 'contactMethodValue' only if the method is NOT 'email'
        if (data.preferredContactMethod && data.preferredContactMethod.toLowerCase() !== 'email' && (!data.contactMethodValue || data.contactMethodValue.length < 2)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["contactMethodValue"],
                message: t('validation.contactValueRequired'),
            });
        }
    });


export type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

// ===== Hook =====
export function useContactForm() {
    const { toast } = useToast();
    const locale = useLocale();
    const t = useTranslations('ContactSection');
    const contactSchema = createContactSchema(t);

    const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(null);
    const [availableRequestTypes, setAvailableRequestTypes] = useState<string[]>([]);
    const [isSubmitting, startSubmission] = useTransition();
    const [isGettingSuggestions, startGettingSuggestions] = useTransition();
    const [isGeneratingProjectIdea, startGeneratingProjectIdea] = useTransition();
    const [isSuggestionsDialogOpen, setIsSuggestionsDialogOpen] = useState(false);
    const [isProjectIdeaDialogOpen, setIsProjectIdeaDialogOpen] = useState(false);
    const [suggestedFaqs, setSuggestedFaqs] = useState<string[]>([]);
    const [structuredProjectIdea, setStructuredProjectIdea] = useState<string>("");

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        mode: 'onChange',
        defaultValues: {
            formType: 'project',
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

    const { watch, setValue, reset, trigger, getValues } = form;

    const watchedFormType = watch("formType");
    const isProjectMode = watchedFormType === 'project';
    const watchedBeneficiaryType = watch("beneficiaryType") as BeneficiaryType;
    const watchedContactMethod = watch("preferredContactMethod");
    const watchedEmail = watch("email");

    const showContactValueField = watchedContactMethod && watchedContactMethod.toLowerCase() !== 'email';

    // Fetch contact methods
    useEffect(() => {
        async function fetchContactMethods() {
            const methods = await getContactMethodsAction();
            setContactMethods(methods);
        }
        fetchContactMethods();
    }, []);

    // EFFECT: Dynamically update available request types based on beneficiary
    useEffect(() => {
        if (watchedBeneficiaryType && requestTypesByBeneficiary[watchedBeneficiaryType]) {
            setAvailableRequestTypes(requestTypesByBeneficiary[watchedBeneficiaryType]);
        } else {
            setAvailableRequestTypes([]);
        }
        setValue("requestType", "");
    }, [watchedBeneficiaryType, setValue]);

    // EFFECT: Re-validate the form when the form type changes
    useEffect(() => {
        if (Object.keys(form.formState.errors).length > 0) {
            trigger();
        }
    }, [isProjectMode, trigger, form.formState.errors]);

    // EFFECT: Automatically set contact value if method is email.
    useEffect(() => {
        if (watchedContactMethod?.toLowerCase() === 'email') {
            setValue('contactMethodValue', watchedEmail, { shouldValidate: true });
        }
    }, [watchedContactMethod, watchedEmail, setValue]);

    // Handlers
    const handleContactMethodChange = (value: string) => {
        setValue("preferredContactMethod", value, { shouldValidate: true });
        const newSelectedMethod = contactMethods.find((m) => m.name === value) || null;
        setSelectedMethod(newSelectedMethod);

        if (newSelectedMethod?.name.toLowerCase() !== 'email') {
            setValue("contactMethodValue", "", { shouldValidate: true });
        }
    };

    const onSubmit = async (data: ContactFormData) => {
        startSubmission(async () => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, val]) => {
                if (val) formData.append(key, val.toString());
            });

            formData.append('isProject', (data.formType === 'project').toString());

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

    // ========= START: UPDATE AI CALL WITH FULL CONTEXT =========
    const getStructuredProjectIdea = () => {
        // Get all relevant values from the form
        const { message, beneficiaryType, requestType } = getValues();

        if (!isProjectMode || !message || message.length < 20) {
            toast({
                title: t('toast.ideaWarningTitle'),
                description: t('toast.ideaWarningDescription'),
                variant: "destructive",
            });
            return;
        }
        startGeneratingProjectIdea(async () => {
            // Create the context object
            const context = {
                description: message,
                beneficiaryType: beneficiaryType,
                requestType: requestType,
            };

            // Pass the entire context object to the server action
            const result = await generateProjectIdeaAction(context);

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
    // ========= END: UPDATE AI CALL WITH FULL CONTEXT =========

    return {
        form,
        locale,
        contactMethods,
        selectedMethod,
        isProjectMode,
        showContactValueField,
        availableRequestTypes,
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

