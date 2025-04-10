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
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { createCourse } from "@/features/courses/actions/courses";

function CourseForm() {
  //useForm hook along with zodResolver to validate the form data
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Upon form submission, the onSubmit function is called with the form input data.
  const onSubmit = (data: z.infer<typeof courseSchema>) => {
    createCourse(data);
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
          Save
        </Button>
      </form>
    </Form>
  );
}

export default CourseForm;
