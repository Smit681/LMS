import { db } from "@/drizzle/db";
import { UserRole, UserTable } from "@/drizzle/schema";
import { getUserIDTag } from "@/features/users/db/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";
const client = await clerkClient();

//This function will sync user data from database to clerk public metadata. Specifically user id and role.
export function syncClerkUserMetadata(user: {
  id: string;
  clerkUserId: string;
  role: UserRole;
}) {
  return client.users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: {
      dbId: user.id,
      role: user.role,
    },
  });
}

//useful to get the current logged user's general information like their clerkUserID, userID and role. Also returning redirectToSignIn function if the user is not signed in.
export async function getCurrentUser({ allData = false } = {}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  //This is handling an edge case. If userID is not null meaning that user is cleared on clerk but if dbID is null meaning the user is not yet synced with database then redirect user to the mentioned URL, sync the user info and redirect them beck here. This happens when user creates an account though signup on purchase page and this can happen only once per user.
  if (userId && sessionClaims.dbId == null) {
    redirect("/api/clerk/syncUsers");
  }

  return {
    clerkUserID: userId,
    userID: sessionClaims?.dbId,
    role: sessionClaims?.role,
    user:
      allData && sessionClaims && sessionClaims?.dbId
        ? await getUser(sessionClaims.dbId)
        : undefined,
    redirectToSignIn,
  };
}

//This function will run a database query to find the user with userID and return the user data. Also, it will cache the data for the user with the given userID.
async function getUser(userId: string) {
  "use cache";
  cacheTag(getUserIDTag(userId));
  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
  });
}
