
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSiteSettingsAction, updateSiteSettingsAction } from "@/app/actions";
import { useEffect, useState, useTransition } from "react";
import type { SiteSettings } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const siteSettingsSchema = z.object({
  stats: z.object({
    satisfaction: z.coerce.number().min(0).max(100),
    projects: z.coerce.number().min(0),
    experience: z.coerce.number().min(0),
    team: z.coerce.number().min(0),
  }),
});

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isFetching, startFetchingTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof siteSettingsSchema>>({
    resolver: zodResolver(siteSettingsSchema),
  });

  useEffect(() => {
    startFetchingTransition(async () => {
      const fetchedSettings = await getSiteSettingsAction();
      setSettings(fetchedSettings);
      form.reset(fetchedSettings);
    });
  }, [form]);

  const handleSubmit = (values: z.infer<typeof siteSettingsSchema>) => {
    startTransition(async () => {
      const result = await updateSiteSettingsAction(values);
      if (result.success) {
        toast({
          title: "Settings Updated",
          description: "Site settings have been successfully updated.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
      {isFetching ? (
        <Card>
            <CardHeader>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Why Choose Us Statistics</CardTitle>
            <CardDescription>
              Update the numbers that appear in the "Why Choose Us" section.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="satisfaction">Client Satisfaction (%)</Label>
                  <Input id="satisfaction" type="number" {...form.register("stats.satisfaction")} />
                  {form.formState.errors.stats?.satisfaction && <p className="text-destructive text-sm">{form.formState.errors.stats.satisfaction.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="projects">Projects Completed</Label>
                  <Input id="projects" type="number" {...form.register("stats.projects")} />
                  {form.formState.errors.stats?.projects && <p className="text-destructive text-sm">{form.formState.errors.stats.projects.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input id="experience" type="number" {...form.register("stats.experience")} />
                  {form.formState.errors.stats?.experience && <p className="text-destructive text-sm">{form.formState.errors.stats.experience.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="team">Expert Team Members</Label>
                  <Input id="team" type="number" {...form.register("stats.team")} />
                  {form.formState.errors.stats?.team && <p className="text-destructive text-sm">{form.formState.errors.stats.team.message}</p>}
                </div>
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
