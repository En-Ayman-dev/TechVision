
"use client";
import { useRef } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TeamMember } from "@/lib/types";
import { useEffect, useTransition } from "react";
import { addTeamMemberAction, updateTeamMemberAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface TeamMemberFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  member: TeamMember | null;
  onSubmit: () => void;
}

const teamMemberSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  image: z.string().url("Image must be a valid URL (e.g., https://placehold.co/400x400.png)."),
  social: z.object({
    twitter: z.string().url("Must be a valid URL or empty.").or(z.literal("")),
    linkedin: z.string().url("Must be a valid URL or empty.").or(z.literal("")),
  }),
  dataAiHint: z.string().optional(),
});

export function TeamMemberForm({ isOpen, onOpenChange, member, onSubmit }: TeamMemberFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof teamMemberSchema>>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      image: "https://placehold.co/400x400.png",
      social: { twitter: "", linkedin: "" },
      dataAiHint: ""
    },
  });

  useEffect(() => {
    if (member) {
      form.reset(member);
    } else {
      form.reset({
        name: "",
        role: "",
        image: "https://placehold.co/400x400.png",
        social: { twitter: "", linkedin: "" },
        dataAiHint: ""
      });
    }
  }, [member, form, isOpen]);

  const handleSubmit = (values: z.infer<typeof teamMemberSchema>) => {
    startTransition(async () => {
      const action = member ? updateTeamMemberAction : addTeamMemberAction;
      const result = await action(values);
      if (result.success) {
        toast({
          title: member ? "Member Updated" : "Member Added",
          description: result.message,
        });
        onSubmit();
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Team Member" : "Add New Member"}</DialogTitle>
          <DialogDescription>
            {member ? "Update the details of the team member." : "Fill in the details to add a new team member."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" {...form.register("role")} />
            {form.formState.errors.role && <p className="text-destructive text-sm">{form.formState.errors.role.message}</p>}
          </div>
          {/* <div className="grid gap-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" {...form.register("image")} />
            {form.formState.errors.image && <p className="text-destructive text-sm">{form.formState.errors.image.message}</p>}
          </div> */}
          {/* ✅ حقل عرض رابط الصورة بعد الرفع */}
          <div className="grid gap-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              {...form.register("image")}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* ✅ زر رفع صورة إلى Cloudinary */}
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            onClick={async () => {
              const fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.accept = "image/*";
              fileInput.click();
              fileInput.onchange = async () => {
                const file = fileInput.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "assetsTeam"); // ✅ اكتب هنا اسم الـ Upload Preset من Cloudinary

                try {
                  const res = await fetch("https://api.cloudinary.com/v1_1/dqvyzrdbc/image/upload", {
                    method: "POST",
                    body: formData,
                  });

                  const data = await res.json();

                  if (data.secure_url) {
                    form.setValue("image", data.secure_url); // ✅ نحفظ رابط الصورة في الحقل
                    toast({
                      title: "Image uploaded",
                      description: "Image uploaded successfully.",
                    });
                  } else {
                    toast({
                      title: "Upload failed",
                      description: "No URL returned from Cloudinary.",
                      variant: "destructive",
                    });
                  }
                } catch (error) {
                  toast({
                    title: "Upload error",
                    description: "An error occurred while uploading the image.",
                    variant: "destructive",
                  });
                }
              };
            }}
          >
            {isPending ? "Uploading..." : "Upload Image"}
          </Button>


          <div className="grid gap-2">
            <Label htmlFor="twitter">Twitter URL</Label>
            <Input id="twitter" {...form.register("social.twitter")} placeholder="#" />
            {form.formState.errors.social?.twitter && <p className="text-destructive text-sm">{form.formState.errors.social.twitter.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input id="linkedin" {...form.register("social.linkedin")} placeholder="#" />
            {form.formState.errors.social?.linkedin && <p className="text-destructive text-sm">{form.formState.errors.social.linkedin.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dataAiHint">AI Image Hint</Label>
            <Input id="dataAiHint" {...form.register("dataAiHint")} placeholder="e.g., 'professional man'" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {member ? "Save Changes" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
