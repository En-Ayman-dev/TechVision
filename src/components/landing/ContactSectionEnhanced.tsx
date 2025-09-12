// "use client"

// // ========= START: ADD IMPORTS =========
// import { useEffect } from "react"
// import { useLocale } from "next-intl";
// import { ContactMethod } from "@/lib/types";
// import { getContactMethodsAction } from "@/app/admin.actions";
// // ========= END: ADD IMPORTS =========

// import { useState, useTransition } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Sparkles, Send, MapPin, Phone, Mail, Clock, Lightbulb } from "lucide-react"
// import { LoadingSpinner } from "@/components/ui/loading-spinner"
// import { useToast } from "@/hooks/use-toast"
// import { useTranslations } from "next-intl"
// import { sendMessageAction, getContactSuggestionsAction, generateProjectIdeaAction } from "@/app/contact.actions"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
// import { Switch } from "@/components/ui/switch"
// import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select"
// import ReactMarkdown from "react-markdown";


// // ========= START: UPDATE ZOD SCHEMAS =========
// const baseSchema = {
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Please enter a valid email address"),
//   // New fields for contact method
//   preferredContactMethod: z.string().min(1, "Please select a contact method."),
//   contactMethodValue: z.string().min(2, "This field is required."),
// };

// const projectSchema = z.object({
//   ...baseSchema,
//   message: z.string().min(20, "Project idea must be at least 20 characters long."),
//   projectIdea: z.string().optional().or(z.literal('')),
//   beneficiaryType: z.string().min(1, "Beneficiary type is required."),
//   requestType: z.string().min(1, "Request type is required."),
// });

// const generalMessageSchema = z.object({
//   ...baseSchema,
//   message: z.string().min(10, "Message must be at least 10 characters long."),
//   projectIdea: z.string().optional().or(z.literal('')),
//   beneficiaryType: z.string().optional().or(z.literal('')),
//   requestType: z.string().optional().or(z.literal('')),
// });
// // ========= END: UPDATE ZOD SCHEMAS =========


// type ContactFormData = z.infer<typeof projectSchema> | z.infer<typeof generalMessageSchema>;

// export function ContactSectionEnhanced() {
//   const t = useTranslations('ContactSection');
//   const locale = useLocale();

//   // ========= START: ADD NEW STATES =========
//   const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
//   const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(null);
//   // ========= END: ADD NEW STATES =========

//   const [isProjectMode, setIsProjectMode] = useState(true);
//   const [isSubmitting, startSubmission] = useTransition();
//   const [isGettingSuggestions, startGettingSuggestions] = useTransition();
//   const [isGeneratingProjectIdea, startGeneratingProjectIdea] = useTransition();
//   const [isSuggestionsDialogOpen, setIsSuggestionsDialogOpen] = useState(false);
//   const [isProjectIdeaDialogOpen, setIsProjectIdeaDialogOpen] = useState(false);
//   const [suggestedFaqs, setSuggestedFaqs] = useState<string[]>([]);
//   const [structuredProjectIdea, setStructuredProjectIdea] = useState<string>('');
//   const { toast } = useToast();

//   const form = useForm<ContactFormData>({
//     resolver: zodResolver(isProjectMode ? projectSchema : generalMessageSchema),
//     // ========= START: UPDATE DEFAULT VALUES =========
//     defaultValues: {
//       name: "",
//       email: "",
//       message: "",
//       projectIdea: "",
//       beneficiaryType: "",
//       requestType: "",
//       preferredContactMethod: "",
//       contactMethodValue: "",
//     },
//     // ========= END: UPDATE DEFAULT VALUES =========
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//     setValue,
//   } = form;

//   // ========= START: FETCH CONTACT METHODS =========
//   useEffect(() => {
//     async function fetchContactMethods() {
//       const methods = await getContactMethodsAction();
//       setContactMethods(methods);
//     }
//     fetchContactMethods();
//   }, []);
//   // ========= END: FETCH CONTACT METHODS =========


//   // ========= START: ADD WATCHER & HANDLER FOR DYNAMIC INPUT =========
//   const handleContactMethodChange = (value: string) => {
//     setValue("preferredContactMethod", value, { shouldValidate: true });
//     const newSelectedMethod = contactMethods.find(m => m.name === value) || null;
//     setSelectedMethod(newSelectedMethod);
//     setValue("contactMethodValue", "", { shouldValidate: true }); // Reset the input value on change
//   }
//   // ========= END: ADD WATCHER & HANDLER FOR DYNAMIC INPUT =========

//   const watchedMessage = watch("message");
//   const watchedInquiry = watch("projectIdea");

//   const onSubmit = async (data: ContactFormData) => {
//     startSubmission(async () => {
//       const formData = new FormData();
//       formData.append("name", data.name);
//       formData.append("email", data.email);
//       formData.append("message", data.message);
//       formData.append("inquiry", data.projectIdea || "");
//       formData.append("beneficiaryType", data.beneficiaryType || "");
//       formData.append("requestType", data.requestType || "");

//       // ========= START: APPEND NEW DATA TO FORMDATA =========
//       if (data.preferredContactMethod) {
//         formData.append("preferredContactMethod", data.preferredContactMethod);
//       }
//       if (data.contactMethodValue) {
//         formData.append("contactMethodValue", data.contactMethodValue);
//       }
//       // ========= END: APPEND NEW DATA TO FORMDATA =========

//       const result = await sendMessageAction(formData);

//       if (result.success) {
//         toast({
//           title: t('toast.successTitle'),
//           description: t('toast.successDescription'),
//         });
//         reset();
//         setSelectedMethod(null); // Reset selected method state
//       } else {
//         toast({
//           title: t('toast.errorTitle'),
//           description: result.message || t('toast.errorDescription'),
//           variant: "destructive"
//         });
//       }
//     });
//   };

//   const getAISuggestions = () => {
//     const inputForSuggestions = isProjectMode ? watchedInquiry : watchedMessage;

//     if (!inputForSuggestions || inputForSuggestions.length < 10) {
//       toast({
//         title: t('toast.aiWarningTitle'),
//         description: t('toast.aiWarningDescription'),
//         variant: "destructive",
//       });
//       return;
//     }

//     startGettingSuggestions(async () => {
//       const result = await getContactSuggestionsAction(inputForSuggestions);
//       if (result.success && result.suggestions) {
//         setSuggestedFaqs(result.suggestions);
//         setIsSuggestionsDialogOpen(true);
//       } else {
//         toast({
//           title: t('toast.aiErrorTitle'),
//           description: result.message || t('toast.aiErrorDescription'),
//           variant: "destructive"
//         });
//       }
//     });
//   };

//   const handleSelectSuggestion = (suggestion: string) => {
//     const targetField = isProjectMode ? "projectIdea" : "message";
//     const currentText = watch(targetField) || "";
//     setValue(targetField, `${currentText} ${suggestion}`, { shouldValidate: true });
//     setIsSuggestionsDialogOpen(false);
//   };

//   const getStructuredProjectIdea = () => {
//     if (!isProjectMode || !watchedMessage || watchedMessage.length < 20) {
//       toast({
//         title: t('toast.ideaWarningTitle'),
//         description: t('toast.ideaWarningDescription'),
//         variant: "destructive",
//       });
//       return;
//     }

//     startGeneratingProjectIdea(async () => {
//       const result = await generateProjectIdeaAction(watchedMessage);
//       if (result.success && result.structuredIdea) {
//         setStructuredProjectIdea(result.structuredIdea);
//         setIsProjectIdeaDialogOpen(true);
//       } else {
//         toast({
//           title: t('toast.ideaErrorTitle'),
//           description: result.message || t('toast.ideaErrorDescription'),
//           variant: "destructive"
//         });
//       }
//     });
//   };

//   const handleAcceptProjectIdea = () => {
//     setValue("message", structuredProjectIdea, { shouldValidate: true });
//     setIsProjectIdeaDialogOpen(false);
//   };


//   return (
//     <section id="contact" className="py-20 bg-muted/50">
//       <div className="container mx-auto px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
//             <p className="text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               <Card>
//                 <CardContent className="p-6">
//                   <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                     <div className="flex items-center space-x-4 justify-end mb-4">
//                       <Label htmlFor="toggle-mode">{t('toggleModeLabel')}</Label>
//                       <Switch
//                         id="toggle-mode"
//                         className="ml-4"
//                         checked={isProjectMode}
//                         onCheckedChange={setIsProjectMode}
//                       />
//                     </div>

//                     <div className="grid md:grid-cols-2 gap-4">
//                       <div>
//                         <Label htmlFor="name">{t('name')}</Label>
//                         <Input
//                           id="name"
//                           {...register("name")}
//                           placeholder={t('namePlaceholder')}
//                           className={errors.name ? "border-red-500" : ""}
//                         />
//                         {errors.name && <p className="text-sm text-red-500 mt-1">{t('validation.nameMin')}</p>}
//                       </div>
//                       <div>
//                         <Label htmlFor="email">{t('emailLabel')}</Label>
//                         <Input
//                           id="email"
//                           type="email"
//                           {...register("email")}
//                           placeholder={t('emailPlaceholder')}
//                           className={errors.email ? "border-red-500" : ""}
//                         />
//                         {errors.email && <p className="text-sm text-red-500 mt-1">{t('validation.emailInvalid')}</p>}
//                       </div>
//                     </div>

//                     {/* ========= START: NEW DYNAMIC CONTACT FIELDS ========= */}
//                     <div className="grid md:grid-cols-2 gap-4">
//                       <div>
//                         <Label htmlFor="preferredContactMethod">{t('preferredContactMethod')}</Label>
//                         <Select onValueChange={handleContactMethodChange} value={watch("preferredContactMethod")}>
//                           <SelectTrigger>
//                             <SelectValue placeholder={t('preferredContactMethodPlaceholder')} />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {contactMethods.map((method) => (
//                               <SelectItem key={method.id} value={method.name}>
//                                 {locale === 'ar' ? method.label_ar : method.label_en}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         {errors.preferredContactMethod && <p className="text-sm text-red-500 mt-1">{errors.preferredContactMethod.message}</p>}
//                       </div>
//                       <div>
//                         {selectedMethod && (
//                           <>
//                             <Label htmlFor="contactMethodValue">{locale === 'ar' ? selectedMethod.label_ar : selectedMethod.label_en}</Label>
//                             <Input
//                               id="contactMethodValue"
//                               type={selectedMethod.inputType}
//                               {...register("contactMethodValue")}
//                               placeholder={locale === 'ar' ? selectedMethod.placeholder_ar : selectedMethod.placeholder_en}
//                               className={errors.contactMethodValue ? "border-red-500" : ""}
//                             />
//                             {errors.contactMethodValue && <p className="text-sm text-red-500 mt-1">{errors.contactMethodValue.message}</p>}
//                           </>
//                         )}
//                       </div>
//                     </div>
//                     {/* ========= END: NEW DYNAMIC CONTACT FIELDS ========= */}

//                     <div className="grid md:grid-cols-2 gap-4">
//                       {/* ... Beneficiary and Request Type fields remain here ... */}
//                       <div>
//                         <Label htmlFor="beneficiaryType">{t('beneficiaryType')}</Label>
//                         <Select onValueChange={(value) => setValue("beneficiaryType", value, { shouldValidate: true })} value={watch("beneficiaryType") as string}>
//                           <SelectTrigger>
//                             <SelectValue placeholder={t('beneficiaryTypePlaceholder')} />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="student">{t('beneficiaryTypeOptions.student')}</SelectItem>
//                             <SelectItem value="individual">{t('beneficiaryTypeOptions.individual')}</SelectItem>
//                             <SelectItem value="company">{t('beneficiaryTypeOptions.company')}</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {errors.beneficiaryType && (
//                           <p className="text-sm text-red-500 mt-1">
//                             {t(`validation.beneficiaryTypeRequired`)}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <Label htmlFor="requestType">{t('requestType')}</Label>
//                         <Select onValueChange={(value) => setValue("requestType", value, { shouldValidate: true })} value={watch("requestType") as string}>
//                           <SelectTrigger>
//                             <SelectValue placeholder={t('requestTypePlaceholder')} />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="graduationProject">{t('requestTypeOptions.graduationProject')}</SelectItem>
//                             <SelectItem value="appDevelopment">{t('requestTypeOptions.appDevelopment')}</SelectItem>
//                             <SelectItem value="techConsultation">{t('requestTypeOptions.techConsultation')}</SelectItem>
//                             <SelectItem value="problemSolving">{t('requestTypeOptions.problemSolving')}</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {errors.requestType && (
//                           <p className="text-sm text-red-500 mt-1">
//                             {t(`validation.requestTypeRequired`)}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* ... Rest of the form fields (message, project idea, buttons) remain the same ... */}
//                     <div>
//                       <div className="flex justify-between items-center mb-2">
//                         <Label htmlFor="message">
//                           {isProjectMode ? t('projectIdeaLabel') : t('messageLabel_general')}
//                         </Label>
//                         {isProjectMode && (
//                           <Button
//                             type="button"
//                             variant="outline"
//                             onClick={getStructuredProjectIdea}
//                             disabled={isGeneratingProjectIdea || !watchedMessage || watchedMessage.length < 20}
//                             aria-label={t('generateAcademicIdea')}
//                             className="px-2"
//                           >
//                             AI      {isGeneratingProjectIdea ? (
//                               <LoadingSpinner size="sm" />
//                             ) : (
//                               <Lightbulb className="w-4 h-4" />
//                             )}
//                           </Button>
//                         )}
//                       </div>
//                       <Textarea
//                         id="message"
//                         {...register("message")}
//                         placeholder={isProjectMode ? t('projectIdeaPlaceholder') : t('messagePlaceholder_general')}
//                         rows={6}
//                         className={errors.message ? "border-red-500" : ""}
//                         aria-describedby={errors.message ? "message-error" : undefined}
//                       />
//                       {errors.message && (
//                         <p id="message-error" className="text-sm text-red-500 mt-1">
//                           {isProjectMode ? t(`validation.projectIdeaMin`) : t(`validation.messageMin`)}
//                         </p>
//                       )}
//                     </div>
//                     {isProjectMode && (
//                       <div>
//                         <div className="flex justify-between items-center mb-2">
//                           <Label htmlFor="projectIdea">{t('inquiryLabel')}</Label>
//                           <Button
//                             type="button"
//                             variant="outline"
//                             onClick={getAISuggestions}
//                             disabled={isGettingSuggestions || !watchedInquiry || watchedInquiry.length < 10}
//                             aria-label={t('getAISuggestions')}
//                             className="px-2"
//                           >
//                             AI      {isGettingSuggestions ? (
//                               <LoadingSpinner size="sm" />
//                             ) : (
//                               <Sparkles className="w-4 h-4" />
//                             )}
//                           </Button>
//                         </div>
//                         <Input
//                           id="projectIdea"
//                           {...register("projectIdea")}
//                           placeholder={t('inquiryPlaceholder')}
//                           className={errors.projectIdea ? "border-red-500" : ""}
//                           aria-describedby={errors.projectIdea ? "inquiry-error" : undefined}
//                         />
//                         {errors.projectIdea && (
//                           <p id="inquiry-error" className="text-sm text-red-500 mt-1">
//                             {t(`validation.inquiryMin`)}
//                           </p>
//                         )}
//                       </div>
//                     )}
//                     <div className="flex flex-col sm:flex-row gap-3">
//                       <Button
//                         type="submit"
//                         disabled={isSubmitting || isGettingSuggestions || isGeneratingProjectIdea}
//                         className="flex-1"
//                       >
//                         {isSubmitting ? (
//                           <LoadingSpinner size="sm" className="mr-2 animate-spin" />
//                         ) : (
//                           <Send className="w-4 h-4 mr-2" />
//                         )}
//                         {t('sendMessage')}
//                       </Button>
//                     </div>
//                     <p className="text-xs text-muted-foreground">{t('requiredFields')}</p>
//                   </form>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="lg:col-span-1 space-y-6">
//               {/* ... Contact Information Cards remain the same ... */}
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold mb-6 text-lg">{t('getInTouch')}</h3>
//                   <div className="space-y-4">
//                     <div className="flex items-start gap-3">
//                       <Mail className="w-5 h-5 text-primary mt-0.5" />
//                       <div>
//                         <p className="font-medium">{t('email')}</p>
//                         <a
//                           href="mailto:ayman.alzhabi.dev@gmail.com"
//                           className="text-muted-foreground text-sm hover:underline"
//                         >
//                           ayman.alzhabi.dev@gmail.com
//                         </a>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-3">
//                       <Phone className="w-5 h-5 text-primary mt-0.5" />
//                       <div>
//                         <p className="font-medium">{t('phone')}</p>
//                         <a
//                           href="https://wa.me/967774998429"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-muted-foreground text-sm hover:underline"
//                         >
//                           +967 774 998 429
//                         </a>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-3">
//                       <MapPin className="w-5 h-5 text-primary mt-0.5" />
//                       <div>
//                         <p className="font-medium">{t('address')}</p>
//                         <p className="text-muted-foreground text-sm">
//                           {t('addressLine1')}<br />
//                           {t('addressLine2')}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-3">
//                       <Clock className="w-5 h-5 text-primary mt-0.5" />
//                       <div>
//                         <p className="font-medium">{t('businessHours')}</p>
//                         <p className="text-muted-foreground text-sm">
//                           {t('mondayFriday')}<br />
//                           {t('saturday')}<br />
//                           {t('sunday')}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold mb-4">{t('whyChooseUs')}</h3>
//                   <ul className="space-y-2 text-sm text-muted-foreground">
//                     <li>• {t('reason1')}</li>
//                     <li>• {t('reason2')}</li>
//                     <li>• {t('reason3')}</li>
//                     <li>• {t('reason4')}</li>
//                   </ul>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* ... Dialogs remain the same ... */}
//       <Dialog open={isSuggestionsDialogOpen} onOpenChange={setIsSuggestionsDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>{t('toast.aiSuggestionsTitle')}</DialogTitle>
//             <DialogDescription>{t('toast.aiSuggestionsDescription')}</DialogDescription>
//           </DialogHeader>
//           <div className="flex flex-col space-y-2">
//             {suggestedFaqs.map((faq, index) => (
//               <Button
//                 key={index}
//                 variant="outline"
//                 className="justify-start h-auto whitespace-normal"
//                 onClick={() => handleSelectSuggestion(faq)}
//               >
//                 {faq}
//               </Button>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>
//       <Dialog open={isProjectIdeaDialogOpen} onOpenChange={setIsProjectIdeaDialogOpen}>
//         <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{t('toast.structuredProjectIdeaTitle')}</DialogTitle>
//             <DialogDescription>{t('toast.structuredProjectIdeaDescription')}</DialogDescription>
//           </DialogHeader>
//           <div className="prose dark:prose-invert max-w-none mb-4">
//             <ReactMarkdown>{structuredProjectIdea}</ReactMarkdown>
//           </div>
//           <div className="flex justify-end">
//             <Button onClick={handleAcceptProjectIdea}>{t('acceptIdea')}</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </section>
//   );
// }
"use client";

import { useTranslations } from "next-intl";
import { useContactForm } from "@/hooks/useContactForm";
import { ContactFormUI } from "./ContactFormUI";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { useState } from "react"; // Required for isProjectMode state

export function ContactSectionEnhanced() {
  const t = useTranslations('ContactSection');
  const [isProjectMode, setIsProjectMode] = useState(true);

  // Lift the contact form hook here so dialogs and shared actions use the same state
  const contactFormLogic = useContactForm(isProjectMode);

  const {
    suggestedFaqs,
    structuredProjectIdea,
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
    setValue("projectIdea", structuredProjectIdea, { shouldValidate: true });
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
              <ContactFormUI isProjectMode={isProjectMode} setIsProjectMode={setIsProjectMode} contactFormLogic={contactFormLogic} />
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

      {/* [RE-INTEGRATED] AI Dialogs are placed here, in the main container */}
      <Dialog open={contactFormLogic.isSuggestionsDialogOpen} onOpenChange={contactFormLogic.setIsSuggestionsDialogOpen}>
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
      <Dialog open={contactFormLogic.isProjectIdeaDialogOpen} onOpenChange={contactFormLogic.setIsProjectIdeaDialogOpen}>
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