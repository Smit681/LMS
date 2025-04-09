import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateUserCache } from "./cache";

// This will insert a newUser passed as data in the parameter into the UserTable of our database. If the user with the same clerkUserID exist, it will simply set the same data or update the differences.
export async function insertUser(data: typeof UserTable.$inferInsert) {
  const [newUser] = await db
    .insert(UserTable)
    .values(data)
    .returning()
    .onConflictDoUpdate({
      target: [UserTable.clerkUserId],
      set: data,
    });

  if (newUser == null) throw Error("Failed to Create New User");

  // Revalidate the cache whenever a new user is created or updated or deleted.
  revalidateUserCache(newUser.id);
  return newUser;
}

//I can have clerkUserID in the data but we don't want to update clerkUserID. Everything we pass through data will wil updated here.
export async function updateUser(
  clerkUserID: string,
  data: Partial<typeof UserTable.$inferInsert>
) {
  const [updatedUser] = await db
    .update(UserTable)
    .set(data)
    .where(eq(UserTable.clerkUserId, clerkUserID))
    .returning();

  if (updatedUser == null) throw Error("Failed to Update User");
  revalidateUserCache(updatedUser.id);

  return updatedUser;
}

//We don't want to completed delete users from our database as we still want to link the user to purchases.So here we update the user's personal identifing information with deleted string.
export async function deleteUser(clerkUserID: string) {
  const [deletedUser] = await db
    .update(UserTable)
    .set({
      deletedAt: new Date(),
      email: "deleted@deleted.com",
      name: "Deleted user",
      imageUrl: null,
    })
    .where(eq(UserTable.clerkUserId, clerkUserID))
    .returning();

  if (deletedUser == null) throw Error("Failed to Update User");
  revalidateUserCache(deletedUser.id);

  return deletedUser;
}
