
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
import { Sparkles, Send, MapPin, Phone, Mail, Clock } from "lucide-react" // تم إزالة Loader2
import { LoadingSpinner } from "@/components/ui/loading-spinner" // تم إضافة LoadingSpinner
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"
import { sendMessageAction, getContactSuggestionsAction } from "@/app/contact.actions"

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactSectionEnhanced() {
  const t = useTranslations('ContactSection');
  const [isSubmitting, startSubmission] = useTransition();
  const [isGettingSuggestions, startGettingSuggestions] = useTransition();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const watchedMessage = watch("message")

  const onSubmit = async (data: ContactFormData) => {
    startSubmission(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("message", data.message);

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

  const getAISuggestions = async () => {
    if (!watchedMessage || watchedMessage.length < 10) {
      toast({
        title: t('toast.aiWarningTitle'),
        description: t('toast.aiWarningDescription'),
        variant: "destructive",
      });
      return;
    }

    startGettingSuggestions(async () => {
      const result = await getContactSuggestionsAction(watchedMessage);
      if (result.success && result.suggestions) {
        const randomSuggestion = result.suggestions[Math.floor(Math.random() * result.suggestions.length)]
        setValue("message", randomSuggestion, { shouldValidate: true });
        toast({
          title: t('toast.aiSuggestionTitle'),
          description: t('toast.aiSuggestionDescription'),
        });
      } else {
        toast({
          title: t('toast.aiErrorTitle'),
          description: result.message || t('toast.aiErrorDescription'),
          variant: "destructive"
        });
      }
    });
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
                            {t(`validation.${errors.name.message}`)}
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
                            {t(`validation.${errors.email.message}`)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">{t('messageLabel')}</Label>
                      <Textarea
                        id="message"
                        {...register("message")}
                        placeholder={t('messagePlaceholder')}
                        rows={6}
                        className={errors.message ? "border-red-500" : ""}
                        aria-describedby={errors.message ? "message-error" : undefined}
                      />
                      {errors.message && (
                        <p id="message-error" className="text-sm text-red-500 mt-1">
                          {t(`validation.${errors.message.message}`)}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={getAISuggestions}
                        disabled={isGettingSuggestions || isSubmitting}
                        className="flex-1"
                      >
                        {isGettingSuggestions ? (
                          <LoadingSpinner size="sm" className="mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        {t('getAISuggestions')}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || isGettingSuggestions}
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
    </section>
  );
}