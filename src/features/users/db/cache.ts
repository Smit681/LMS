import { revalidateTag } from "next/cache";

type CACHE_TAG =
  | "products"
  | "users"
  | "courses"
  | "userCourseAccess"
  | "courseSections"
  | "lessons"
  | "purchases"
  | "userLessonComplete";

// Global tag for given type
export function getGlobalTag(tag: CACHE_TAG) {
  return `global:${tag}` as const;
}

// Ex. tag all purchases with id 10 -> In this case we will use tage from this function.
export function getIdTag(tag: CACHE_TAG, id: string) {
  return `id:${id}-${tag}` as const;
}

//Ex. tag all courses for userid 10.
export function getUserTag(tag: CACHE_TAG, userId: string) {
  return `user:${userId}-${tag}` as const;
}

// Ex. tag all users with courseid 10.
export function getCourseTag(tag: CACHE_TAG, courseId: string) {
  return `course:${courseId}-${tag}` as const;
}

// Ex. tag all users.
export function getUserGlobalTag() {
  return getGlobalTag("users");
}

// Ex. tag a user with Id 10.
export function getUserIDTag(id: string) {
  return getIdTag("users", id);
}

// Find all the cache tagged with users or userID 10 and revalidate it.
//Why both tags? cache for all users as a group and user with id 10 is totally different.
//Even though we revalidate the cache for all users,
//we still need to revalidate the saperate cache for user with id 10.
export function revalidateUserCache(id: string) {
  revalidateTag(getUserGlobalTag());
  revalidateTag(getUserIDTag(id));
}
