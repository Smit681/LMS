import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

// Ex. tag all courses.
export function getCourseGlobalTag() {
  return getGlobalTag("courses");
}

// Ex. tag a course with Id 10.
export function getCourseIDTag(id: string) {
  return getIdTag("courses", id);
}

// Find all the cache tagged with courses or courseID 10 and revalidate it.
//Why both tags? cache for all courses as a group and course with id 10 is totally different.
//Even though we revalidate the cache for all courses,
//we still need to revalidate the saperate cache for course with id 10.
export function revalidateCourseCache(id: string) {
  revalidateTag(getCourseGlobalTag());
  revalidateTag(getCourseIDTag(id));
}
