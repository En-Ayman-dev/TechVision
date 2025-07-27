"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { sendContactMessageAction, suggestFaqAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, Lightbulb } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    setIsSubmitting(true);
    const result = await sendContactMessageAction(values);
    if (result.success) {
      toast({
        title: "Message Sent!",
        description: result.message,
      });
      form.reset();
      setSuggestions([]);
    } else {
      toast({
        title: "Error",
        description: result.message || "Something went wrong.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };
  
  const handleSuggestFaq = async () => {
    const message = form.getValues("message");
    if (!message || message.length < 10) {
      toast({
        title: "Enter a message",
        description: "Please type at least 10 characters in your message to get suggestions.",
        variant: "destructive",
      });
      return;
    }
    setIsSuggesting(true);
    setSuggestions([]);
    const result = await suggestFaqAction(message);
    if(result.success) {
      setSuggestions(result.suggestions);
    } else {
      toast({
        title: "Could not get suggestions",
        description: "The AI assistant is currently unavailable. Please try again later.",
        variant: "destructive",
      });
    }
    setIsSuggesting(false);
  };

  return (
    <section id="contact" className="bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">Contact Us</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We'd love to hear from you. Fill out the form, and we'll get back to you as soon as possible.
            </p>
            <div className="mt-8">
              {suggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-400" />
                      <span>Suggested FAQs</span>
                    </CardTitle>
                    <CardDescription>Based on your message, these FAQs might help:</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm list-disc pl-5">
                      {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="How can we help you?" {...field} rows={6} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="button" variant="outline" onClick={handleSuggestFaq} disabled={isSuggesting} className="w-full sm:w-auto">
                      {isSuggesting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                      )}
                      Get AI Suggestions
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Message
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
