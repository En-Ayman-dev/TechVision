// "use client"

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

// const contactSchema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
//   message: z.string().min(10),
//   projectIdea: z.string().optional(), // New field for project idea
// })

// type ContactFormData = z.infer<typeof contactSchema>

// export function ContactSectionEnhanced() {
//   const t = useTranslations('ContactSection');
//   const [isSubmitting, startSubmission] = useTransition();
//   const [isGettingSuggestions, startGettingSuggestions] = useTransition();
//   const [isGeneratingProjectIdea, startGeneratingProjectIdea] = useTransition(); // New state for project idea button
//   const [isSuggestionsDialogOpen, setIsSuggestionsDialogOpen] = useState(false);
//   const [isProjectIdeaDialogOpen, setIsProjectIdeaDialogOpen] = useState(false); // New state for project idea dialog
//   const [suggestedFaqs, setSuggestedFaqs] = useState<string[]>([]);
//   const [structuredProjectIdea, setStructuredProjectIdea] = useState<string>(''); // New state for project idea output
//   const { toast } = useToast();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//     setValue,
//   } = useForm<ContactFormData>({
//     resolver: zodResolver(contactSchema),
//   })

//   const watchedMessage = watch("message")
//   const watchedProjectIdea = watch("projectIdea") // Watch new field

//   const onSubmit = async (data: ContactFormData) => {
//     startSubmission(async () => {
//       const formData = new FormData();
//       formData.append("name", data.name);
//       formData.append("email", data.email);
//       // We will send the combined message and project idea in the message field
//       let fullMessage = data.message;
//       if (data.projectIdea) {
//         fullMessage += `\n\nProject Idea: ${data.projectIdea}`;
//       }
//       formData.append("message", fullMessage);

//       const result = await sendMessageAction(formData);

//       if (result.success) {
//         toast({
//           title: t('toast.successTitle'),
//           description: t('toast.successDescription'),
//         });
//         reset();
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
//     if (!watchedMessage || watchedMessage.length < 10) {
//       toast({
//         title: t('toast.aiWarningTitle'),
//         description: t('toast.aiWarningDescription'),
//         variant: "destructive",
//       });
//       return;
//     }

//     startGettingSuggestions(async () => {
//       const result = await getContactSuggestionsAction(watchedMessage);
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
//     setValue("message", suggestion, { shouldValidate: true });
//     setIsSuggestionsDialogOpen(false);
//   };
  
//   // New handler for the project idea button
//   const getStructuredProjectIdea = () => {
//     if (!watchedProjectIdea || watchedProjectIdea.length < 20) {
//       toast({
//         title: t('toast.ideaWarningTitle'),
//         description: t('toast.ideaWarningDescription'),
//         variant: "destructive",
//       });
//       return;
//     }

//     startGeneratingProjectIdea(async () => {
//       const result = await generateProjectIdeaAction(watchedProjectIdea);
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

//   return (
//     <section id="contact" className="py-20 bg-muted/50">
//       <div className="container mx-auto px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
//             <p className="text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* Contact Information */}
//             <div className="lg:col-span-1 space-y-6">
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

//             {/* Contact Form */}
//             <div className="lg:col-span-2">
//               <Card>
//                 <CardContent className="p-6">
//                   <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                     <div className="grid md:grid-cols-2 gap-4">
//                       <div>
//                         <Label htmlFor="name">{t('name')}</Label>
//                         <Input
//                           id="name"
//                           {...register("name")}
//                           placeholder={t('namePlaceholder')}
//                           className={errors.name ? "border-red-500" : ""}
//                           aria-describedby={errors.name ? "name-error" : undefined}
//                         />
//                         {errors.name && (
//                           <p id="name-error" className="text-sm text-red-500 mt-1">
//                             {t(`validation.nameMin`)}
//                           </p>
//                         )}
//                       </div>

//                       <div>
//                         <Label htmlFor="email">{t('emailLabel')}</Label>
//                         <Input
//                           id="email"
//                           type="email"
//                           {...register("email")}
//                           placeholder={t('emailPlaceholder')}
//                           className={errors.email ? "border-red-500" : ""}
//                           aria-describedby={errors.email ? "email-error" : undefined}
//                         />
//                         {errors.email && (
//                           <p id="email-error" className="text-sm text-red-500 mt-1">
//                             {t(`validation.emailInvalid`)}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div>
//                       <Label htmlFor="message">{t('messageLabel')}</Label>
//                       <Textarea
//                         id="message"
//                         {...register("message")}
//                         placeholder={t('messagePlaceholder')}
//                         rows={6}
//                         className={errors.message ? "border-red-500" : ""}
//                         aria-describedby={errors.message ? "message-error" : undefined}
//                       />
//                       {errors.message && (
//                         <p id="message-error" className="text-sm text-red-500 mt-1">
//                           {t(`validation.messageMin`)}
//                         </p>
//                       )}
//                     </div>
                    
//                     {/* New project idea section */}
//                     <div>
//                       <Label htmlFor="projectIdea">{t('projectIdeaLabel')}</Label>
//                       <div className="flex gap-2">
//                         <Input
//                           id="projectIdea"
//                           {...register("projectIdea")}
//                           placeholder={t('projectIdeaPlaceholder')}
//                           className="flex-1"
//                           aria-describedby={errors.projectIdea ? "project-idea-error" : undefined}
//                         />
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={getStructuredProjectIdea}
//                           disabled={isGeneratingProjectIdea || !watchedProjectIdea || watchedProjectIdea.length < 20}
//                           aria-label={t('generateAcademicIdea')}
//                         >
//                           {isGeneratingProjectIdea ? (
//                             <LoadingSpinner size="sm" />
//                           ) : (
//                             <Lightbulb className="w-4 h-4" />
//                           )}
//                         </Button>
//                       </div>
//                        {errors.projectIdea && (
//                         <p id="project-idea-error" className="text-sm text-red-500 mt-1">
//                           {t(`validation.projectIdeaMin`)}
//                         </p>
//                       )}
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-3">
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={getAISuggestions}
//                         disabled={isGettingSuggestions || isSubmitting}
//                         className="flex-1"
//                       >
//                         {isGettingSuggestions ? (
//                           <LoadingSpinner size="sm" className="mr-2 animate-spin" />
//                         ) : (
//                           <Sparkles className="w-4 h-4 mr-2" />
//                         )}
//                         {t('getAISuggestions')}
//                       </Button>
//                       <Button
//                         type="submit"
//                         disabled={isSubmitting || isGettingSuggestions}
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
//           </div>
//         </div>
//       </div>
//       {/* New Dialog for AI suggestions */}
//       <Dialog open={isSuggestionsDialogOpen} onOpenChange={setIsSuggestionsDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>{t('toast.aiSuggestionTitle')}</DialogTitle>
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
      
//       {/* New Dialog for structured project idea */}
//       <Dialog open={isProjectIdeaDialogOpen} onOpenChange={setIsProjectIdeaDialogOpen}>
//         <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{t('structuredProjectIdeaTitle')}</DialogTitle>
//             <DialogDescription>{t('structuredProjectIdeaDescription')}</DialogDescription>
//           </DialogHeader>
//           <div className="prose dark:prose-invert max-w-none">
//             {/* The structured idea will be rendered here as markdown */}
//             <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">{structuredProjectIdea}</pre>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </section>
//   );
// }
"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Send, MapPin, Phone, Mail, Clock, Lightbulb } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"
import { sendMessageAction, getContactSuggestionsAction, generateProjectIdeaAction } from "@/app/contact.actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

const projectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(20, "Project idea must be at least 20 characters long."),
  projectIdea: z.string().optional().or(z.literal('')),
});

const generalMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long."),
  projectIdea: z.string().optional().or(z.literal('')),
});

type ContactFormData = z.infer<typeof projectSchema> | z.infer<typeof generalMessageSchema>;

export function ContactSectionEnhanced() {
  const t = useTranslations('ContactSection');
  const [isProjectMode, setIsProjectMode] = useState(true);
  const [isSubmitting, startSubmission] = useTransition();
  const [isGettingSuggestions, startGettingSuggestions] = useTransition();
  const [isGeneratingProjectIdea, startGeneratingProjectIdea] = useTransition();
  const [isSuggestionsDialogOpen, setIsSuggestionsDialogOpen] = useState(false);
  const [isProjectIdeaDialogOpen, setIsProjectIdeaDialogOpen] = useState(false);
  const [suggestedFaqs, setSuggestedFaqs] = useState<string[]>([]);
  const [structuredProjectIdea, setStructuredProjectIdea] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(isProjectMode ? projectSchema : generalMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      projectIdea: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = form;

  const watchedMessage = watch("message");
  const watchedInquiry = watch("projectIdea");

  const onSubmit = async (data: ContactFormData) => {
    startSubmission(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      // Send message field as is
      formData.append("message", data.message);
      // Send projectIdea (now inquiry) field separately
      formData.append("inquiry", data.projectIdea || "");

      const result = await sendMessageAction(formData);

      if (result.success) {
        toast({
          title: t('toast.successTitle'),
          description: t('toast.successDescription'),
        });
        reset();
      } else {
        toast({
          title: t('toast.errorTitle'),
          description: result.message || t('toast.errorDescription'),
          variant: "destructive"
        });
      }
    });
  };

  const getAISuggestions = () => {
    const inputForSuggestions = isProjectMode ? watchedInquiry : watchedMessage;

    if (!inputForSuggestions || inputForSuggestions.length < 10) {
      toast({
        title: t('toast.aiWarningTitle'),
        description: t('toast.aiWarningDescription'),
        variant: "destructive",
      });
      return;
    }

    startGettingSuggestions(async () => {
      const result = await getContactSuggestionsAction(inputForSuggestions);
      if (result.success && result.suggestions) {
        setSuggestedFaqs(result.suggestions);
        setIsSuggestionsDialogOpen(true);
      } else {
        toast({
          title: t('toast.aiErrorTitle'),
          description: result.message || t('toast.aiErrorDescription'),
          variant: "destructive"
        });
      }
    });
  };

  const handleSelectSuggestion = (suggestion: string) => {
    const targetField = isProjectMode ? "projectIdea" : "message";
    const currentText = watch(targetField) || "";
    setValue(targetField, `${currentText} ${suggestion}`, { shouldValidate: true });
    setIsSuggestionsDialogOpen(false);
  };
  
  const getStructuredProjectIdea = () => {
    if (!isProjectMode || !watchedMessage || watchedMessage.length < 20) {
      toast({
        title: t('toast.ideaWarningTitle'),
        description: t('toast.ideaWarningDescription'),
        variant: "destructive",
      });
      return;
    }

    startGeneratingProjectIdea(async () => {
      const result = await generateProjectIdeaAction(watchedMessage);
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
  
  const handleAcceptProjectIdea = () => {
    setValue("message", structuredProjectIdea, { shouldValidate: true });
    setIsProjectIdeaDialogOpen(false);
  };

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-6 text-lg">{t('getInTouch')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">{t('email')}</p>
                        <a
                          href="mailto:ayman.alzhabi.dev@gmail.com"
                          className="text-muted-foreground text-sm hover:underline"
                        >
                          ayman.alzhabi.dev@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">{t('phone')}</p>
                        <a
                          href="https://wa.me/967774998429"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground text-sm hover:underline"
                        >
                          +967 774 998 429
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">{t('address')}</p>
                        <p className="text-muted-foreground text-sm">
                          {t('addressLine1')}<br />
                          {t('addressLine2')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">{t('businessHours')}</p>
                        <p className="text-muted-foreground text-sm">
                          {t('mondayFriday')}<br />
                          {t('saturday')}<br />
                          {t('sunday')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">{t('whyChooseUs')}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {t('reason1')}</li>
                    <li>• {t('reason2')}</li>
                    <li>• {t('reason3')}</li>
                    <li>• {t('reason4')}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center space-x-2 justify-end mb-4">
                      <Label htmlFor="toggle-mode">{t('toggleModeLabel')}</Label>
                      <Switch
                        id="toggle-mode"
                        checked={isProjectMode}
                        onCheckedChange={setIsProjectMode}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">{t('name')}</Label>
                        <Input
                          id="name"
                          {...register("name")}
                          placeholder={t('namePlaceholder')}
                          className={errors.name ? "border-red-500" : ""}
                          aria-describedby={errors.name ? "name-error" : undefined}
                        />
                        {errors.name && (
                          <p id="name-error" className="text-sm text-red-500 mt-1">
                            {t(`validation.nameMin`)}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">{t('emailLabel')}</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder={t('emailPlaceholder')}
                          className={errors.email ? "border-red-500" : ""}
                          aria-describedby={errors.email ? "email-error" : undefined}
                        />
                        {errors.email && (
                          <p id="email-error" className="text-sm text-red-500 mt-1">
                            {t(`validation.emailInvalid`)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="message">
                          {isProjectMode ? t('projectIdeaLabel') : t('messageLabel_general')}
                        </Label>
                        {isProjectMode && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={getStructuredProjectIdea}
                            disabled={isGeneratingProjectIdea || !watchedMessage || watchedMessage.length < 20}
                            aria-label={t('generateAcademicIdea')}
                            className="px-2"
                          >
                            {isGeneratingProjectIdea ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Lightbulb className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      <Textarea
                        id="message"
                        {...register("message")}
                        placeholder={isProjectMode ? t('projectIdeaPlaceholder') : t('messagePlaceholder_general')}
                        rows={6}
                        className={errors.message ? "border-red-500" : ""}
                        aria-describedby={errors.message ? "message-error" : undefined}
                      />
                      {errors.message && (
                        <p id="message-error" className="text-sm text-red-500 mt-1">
                          {isProjectMode ? t(`validation.projectIdeaMin`) : t(`validation.messageMin`)}
                        </p>
                      )}
                    </div>
                    {isProjectMode && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label htmlFor="projectIdea">{t('inquiryLabel')}</Label>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={getAISuggestions}
                            disabled={isGettingSuggestions || !watchedInquiry || watchedInquiry.length < 10}
                            aria-label={t('getAISuggestions')}
                            className="px-2"
                          >
                            {isGettingSuggestions ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <Input
                          id="projectIdea"
                          {...register("projectIdea")}
                          placeholder={t('inquiryPlaceholder')}
                          className={errors.projectIdea ? "border-red-500" : ""}
                          aria-describedby={errors.projectIdea ? "inquiry-error" : undefined}
                        />
                          {errors.projectIdea && (
                          <p id="inquiry-error" className="text-sm text-red-500 mt-1">
                            {t(`validation.inquiryMin`)}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting || isGettingSuggestions || isGeneratingProjectIdea}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <LoadingSpinner size="sm" className="mr-2 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        {t('sendMessage')}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('requiredFields')}</p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isSuggestionsDialogOpen} onOpenChange={setIsSuggestionsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('toast.aiSuggestionsTitle')}</DialogTitle>
            <DialogDescription>{t('toast.aiSuggestionsDescription')}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-2">
            {suggestedFaqs.map((faq, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto whitespace-normal"
                onClick={() => handleSelectSuggestion(faq)}
              >
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
            <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">{structuredProjectIdea}</pre>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAcceptProjectIdea}>{t('acceptIdea')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
