import { db } from "@/drizzle/db";
import { CourseTable } from "@/drizzle/schema";
import { revalidateCourseCache } from "./cache";

//insert course into the databse
export async function insertCourse(data: typeof CourseTable.$inferInsert) {
  const [newCourse] = await db.insert(CourseTable).values(data).returning();

  if (!newCourse) {
    throw new Error("Failed to insert course");
  }

  revalidateCourseCache(newCourse.id);
  return newCourse;
}
