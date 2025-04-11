"use client";

import { courseSchema } from "@/features/courses/schemas/courses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { createCourse, updateCourse } from "@/features/courses/actions/courses";
import LoadingTextSwap from "../../../components/LoadingTextSwap";
import { useTransition } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export function CourseForm({
  course,
}: {
  course?: {
    id: string;
    name: string;
    description: string;
  };
}) {
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: course ?? {
      name: "",
      description: "",
    },
  });

  const [isLoading, startTransition] = useTransition();

  // Upon form submission, the onSubmit function is called with the form input data.
  const onSubmit = (data: z.infer<typeof courseSchema>) => {
    const action =
      course == null ? createCourse : updateCourse.bind(null, course.id);
    startTransition(() => {
      (async () => {
        const obj = await action(data);
        if (obj.error) toast.error(obj.message);
        else toast.success(obj.message);
        redirect(`/admin/courses/${obj.id}/edit`);
      })();
    });
  };

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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-red-500">*</span>Description:
              </FormLabel>
              <FormControl>
                <Textarea className="min-h-20 resize-none" {...field} />
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
      </form>
    </Form>
  );
}

export default CourseForm;
