"use server";

import { z } from "zod";
import { courseSchema } from "../schemas/courses";
import { getCurrentUser } from "@/services/clerk";
import {
  canCreateCourse,
  canDeleteCourses,
  canUpdateCourses,
} from "../permissions/courses";
import { deleteCourseDb, insertCourse, updateCourseDb } from "../db/courses";

export async function createCourse(unsafeData: z.infer<typeof courseSchema>) {
  const { success, data } = courseSchema.safeParse(unsafeData); // Validate the data

  if (!success) {
    return { error: true, message: "Invalid course date" };
  }

  //Get currentUser to find out user role and verify if the user is admin for permission.
  if (!canCreateCourse(await getCurrentUser())) {
    return { error: true, message: "Course Creation not allowed" };
  }

  const course = await insertCourse(data);

  return {
    error: false,
    message: "Course Created Successfully",
    id: course.id,
  };
}

export async function updateCourse(
  id: string,
  unsafeData: z.infer<typeof courseSchema>
) {
  const { success, data } = courseSchema.safeParse(unsafeData); // Validate the data

  if (!success) {
    return { error: true, message: "Invalid course date" };
  }

  //Get currentUser to find out user role and verify if the user is admin for permission.
  if (!canUpdateCourses(await getCurrentUser())) {
    return { error: true, message: "Course Update not allowed" };
  }

  const course = await updateCourseDb(id, data);

  return {
    error: false,
    message: "Course Updated Successfully",
    id: course.id,
  };
}

export async function deleteCourse(id: string) {
  //Get currentUser to find out user role and verify if the user is admin for permission.
  if (!canDeleteCourses(await getCurrentUser())) {
    return { error: true, message: "Course Deletion not allowed" };
  }

  await deleteCourseDb(id);
  return { error: false, message: "Course Deleted Successfully" };
}
