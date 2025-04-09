import { UserRole } from "@/drizzle/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
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
export async function getCurrentUser() {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  return {
    clerkUserID: userId,
    userID: sessionClaims?.dbId,
    role: sessionClaims?.role,
    redirectToSignIn,
  };
}
