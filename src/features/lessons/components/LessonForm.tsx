"use client";

import { LessonStatus, lessonStatuses } from "@/drizzle/schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// import { useTransition } from "react";

import { lessonSchema } from "../schemas/lessons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CourseForm from "@/features/courses/components/CourseForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import LoadingTextSwap from "@/components/LoadingTextSwap";
import { Textarea } from "@/components/ui/textarea";
import { createLesson, updateLesson } from "../actions/lessons";
import { useTransition } from "react";
import { YouTubeVideoPlayer } from "./YouTubeVideoPlayer";

export function LessonForm({
  sections,
  defaultSectionId,
  onSuccess,
  lesson,
}: {
  sections: {
    id: string;
    name: string;
  }[];
  defaultSectionId: string;
  onSuccess?: () => void;
  lesson?: {
    id: string;
    name: string;
    status: LessonStatus;
    youtubeVideoId: string;
    description: string | null;
    sectionId: string;
  };
}) {
  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson?.name ?? "",
      status: lesson?.status ?? "public",
      youtubeVideoId: lesson?.youtubeVideoId ?? "",
      description: lesson?.description ?? "",
      sectionId: lesson?.sectionId ?? defaultSectionId ?? sections[0]?.id ?? "",
    },
  });
  const [isLoading, startTransition] = useTransition();

  // Upon form submission, the onSubmit function is called with the form input data.
  const onSubmit = (data: z.infer<typeof lessonSchema>) => {
    const action =
      lesson == null ? createLesson : updateLesson.bind(null, lesson.id);
    startTransition(() => {
      (async () => {
        const obj = await action(data);
        if (obj.error) toast.error(obj.message);
        else {
          toast.success(obj.message);
          onSuccess?.();
        }
      })();
    });
  };

  const videoId = form.watch("youtubeVideoId");
  return (
    // Form is a shadcn wrapper around react-hook-form
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-red-500">*</span>Name:
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="youtubeVideoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-red-500">*</span>YouTube Video Id:
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sectionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lessonStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-20 resize-none"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="self-end hover:cursor-pointer"
        >
          <LoadingTextSwap isLoading={isLoading}>Save</LoadingTextSwap>
        </Button>
        {videoId && (
          <div className="aspect-video">
            <YouTubeVideoPlayer videoId={videoId} />
          </div>
        )}
      </form>
    </Form>
  );
}

export default CourseForm;
