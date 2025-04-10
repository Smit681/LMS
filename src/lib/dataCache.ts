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
