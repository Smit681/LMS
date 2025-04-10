"use server";

import { z } from "zod";
import { courseSchema } from "../schemas/courses";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/clerk";
import { canCreateCourse } from "../permissions/courses";
import { insertCourse } from "../db/courses";

export async function createCourse(unsafeData: z.infer<typeof courseSchema>) {
  const { success, data } = courseSchema.safeParse(unsafeData); // Validate the data

  if (!success) {
    return { error: true, message: "Invalid course date" };
  }

  if (!canCreateCourse(await getCurrentUser())) {
    return { error: true, message: "Course Creation not allowed" };
  }

  const course = await insertCourse(data);
  redirect(`/admin/courses/${course.id}/edit`);
}
