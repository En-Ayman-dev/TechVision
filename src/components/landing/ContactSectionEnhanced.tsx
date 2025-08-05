"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useNotifications } from "@/components/ui/notification"
import { Sparkles, Send, MapPin, Phone, Mail, Clock } from "lucide-react"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactSectionEnhanced() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false)
  const { addNotification } = useNotifications()

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
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addNotification({
        type: "success",
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      })
      
      reset()
    } catch (error) {
      addNotification({
        type: "error",
        title: "Failed to send message",
        description: "Please try again later or contact us directly.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAISuggestions = async () => {
    if (!watchedMessage || watchedMessage.length < 10) {
      addNotification({
        type: "warning",
        title: "Message too short",
        description: "Please write at least 10 characters to get AI suggestions.",
      })
      return
    }

    setIsGettingSuggestions(true)
    try {
      // Simulate AI suggestion
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const suggestions = [
        "I would like to know more about your web development services and pricing.",
        "Could you provide more details about your project timeline and development process?",
        "I'm interested in discussing a potential collaboration for my business website.",
        "What technologies do you specialize in for modern web applications?",
        "Can you help me with mobile app development and cross-platform solutions?",
      ]
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
      setValue("message", randomSuggestion)
      
      addNotification({
        type: "success",
        title: "AI suggestion applied!",
        description: "Your message has been enhanced with AI suggestions.",
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: "AI suggestions unavailable",
        description: "The AI assistant is currently unavailable. Please try again later.",
      })
    } finally {
      setIsGettingSuggestions(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you. Fill out the form, and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-6 text-lg">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground text-sm">hello@techvision.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-muted-foreground text-sm">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground text-sm">
                          123 Tech Street<br />
                          Innovation City, IC 12345
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Business Hours</p>
                        <p className="text-muted-foreground text-sm">
                          Monday - Friday: 9:00 AM - 6:00 PM<br />
                          Saturday: 10:00 AM - 4:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Why Choose Us?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Fast response within 24 hours</li>
                    <li>• Free consultation and project estimation</li>
                    <li>• Experienced team of developers</li>
                    <li>• Ongoing support and maintenance</li>
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
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          {...register("name")}
                          placeholder="Your Name"
                          className={errors.name ? "border-red-500" : ""}
                          aria-describedby={errors.name ? "name-error" : undefined}
                        />
                        {errors.name && (
                          <p id="name-error" className="text-sm text-red-500 mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="your.email@example.com"
                          className={errors.email ? "border-red-500" : ""}
                          aria-describedby={errors.email ? "email-error" : undefined}
                        />
                        {errors.email && (
                          <p id="email-error" className="text-sm text-red-500 mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        {...register("message")}
                        placeholder="Tell us about your project or how we can help you..."
                        rows={6}
                        className={errors.message ? "border-red-500" : ""}
                        aria-describedby={errors.message ? "message-error" : undefined}
                      />
                      {errors.message && (
                        <p id="message-error" className="text-sm text-red-500 mt-1">
                          {errors.message.message}
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
                          <LoadingSpinner size="sm" className="mr-2" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        Get AI Suggestions
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || isGettingSuggestions}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <LoadingSpinner size="sm" className="mr-2" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        Send Message
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      * Required fields. We respect your privacy and will never share your information.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

