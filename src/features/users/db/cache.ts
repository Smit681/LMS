import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

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
