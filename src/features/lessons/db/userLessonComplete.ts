import { db } from "@/drizzle/db";
import { UserLessonCompleteTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidateUserLessonCompleteCache } from "./cache/userLessonComplete";

export async function updateLessonCompleteStatus({
  lessonId,
  userID,
  complete,
}: {
  lessonId: string;
  userID: string;
  complete: boolean;
}) {
  const userId = userID;
  let completion: { lessonId: string; userId: string } | undefined;
  if (complete) {
    const [c] = await db
      .insert(UserLessonCompleteTable)
      .values({
        lessonId,
        userId,
      })
      .onConflictDoNothing()
      .returning();
    completion = c;
  } else {
    const [c] = await db
      .delete(UserLessonCompleteTable)
      .where(
        and(
          eq(UserLessonCompleteTable.lessonId, lessonId),
          eq(UserLessonCompleteTable.userId, userID)
        )
      )
      .returning();
    completion = c;
  }

  if (completion == null) return;

  revalidateUserLessonCompleteCache({
    lessonId: completion.lessonId,
    userId: completion.userId,
  });

  return completion;
}
