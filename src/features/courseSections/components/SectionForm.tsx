"use client";

import { CourseSectionStatus } from "@/drizzle/schema";

// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { sectionSchema } from "../schemas/sections"
// import { z } from "zod"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { RequiredLabelIcon } from "@/components/RequiredLabelIcon"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { actionToast } from "@/hooks/use-toast"
// import { CourseSectionStatus, courseSectionStatuses } from "@/drizzle/schema"
// import {
//   Select,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
// } from "@/components/ui/select"
// import { createSection, updateSection } from "../actions/sections"

// export function SectionForm({
//   section,
//   courseId,
//   onSuccess,
// }: {
//   section?: {
//     id: string
//     name: string
//     status: CourseSectionStatus
//   }
//   courseId: string
//   onSuccess?: () => void
// }) {
//   const form = useForm<z.infer<typeof sectionSchema>>({
//     resolver: zodResolver(sectionSchema),
//     defaultValues: section ?? {
//       name: "",
//       status: "public",
//     },
//   })

//   async function onSubmit(values: z.infer<typeof sectionSchema>) {
//     const action =
//       section == null
//         ? createSection.bind(null, courseId)
//         : updateSection.bind(null, section.id)
//     const data = await action(values)
//     actionToast({ actionData: data })
//     if (!data.error) onSuccess?.()
//   }

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="flex gap-6 flex-col @container"
//       >
//         <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>
//                   <RequiredLabelIcon />
//                   Name
//                 </FormLabel>
//                 <FormControl>
//                   <Input {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="status"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Status</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {courseSectionStatuses.map(status => (
//                       <SelectItem key={status} value={status}>
//                         {status}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="self-end">
//           <Button disabled={form.formState.isSubmitting} type="submit">
//             Save
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useTransition } from "react";

import { sectionSchema } from "../schemas/sections";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CourseForm from "@/components/CourseForm";
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
import { createSection, updateSection } from "../actions/sections";
import LoadingTextSwap from "@/components/LoadingTextSwap";

export function SectionForm({
  section,
  courseId,
  onSuccess,
}: {
  section?: {
    id: string;
    name: string;
    status: CourseSectionStatus;
  };
  courseId: string;
  onSuccess?: () => void;
}) {
  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: section ?? {
      name: "",
      status: "public",
    },
  });
  console.log(courseId);
  const [isLoading, startTransition] = useTransition();

  // Upon form submission, the onSubmit function is called with the form input data.
  const onSubmit = (data: z.infer<typeof sectionSchema>) => {
    const action =
      section == null
        ? createSection.bind(null, courseId)
        : updateSection.bind(null, section.id);
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-red-500">*</span>Description:
              </FormLabel>
              <FormControl>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
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
