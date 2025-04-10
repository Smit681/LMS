import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

// Ex. tag all users.
export function getCourseGlobalTag() {
  return getGlobalTag("courses");
}

// Ex. tag a user with Id 10.
export function getCourseIDTag(id: string) {
  return getIdTag("courses", id);
}

// Find all the cache tagged with users or userID 10 and revalidate it.
//Why both tags? cache for all users as a group and user with id 10 is totally different.
//Even though we revalidate the cache for all users,
//we still need to revalidate the saperate cache for user with id 10.
export function revalidateCourseCache(id: string) {
  revalidateTag(getCourseGlobalTag());
  revalidateTag(getCourseIDTag(id));
}
