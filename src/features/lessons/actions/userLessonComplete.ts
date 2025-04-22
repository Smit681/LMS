"use server";

import { getCurrentUser } from "@/services/clerk";
import { canUpdateUserLessonCompleteStatus } from "../permissions/userLessonComplete";
import { updateLessonCompleteStatus as updateLessonCompleteStatusDb } from "../db/userLessonComplete";

export async function updateLessonCompleteStatus(
  lessonId: string,
  complete: boolean
) {
  const { userID } = await getCurrentUser();

  const hasPermission = await canUpdateUserLessonCompleteStatus(
    { userID },
    lessonId
  );

  if (userID == null || !hasPermission) {
    return { error: true, message: "Error updating lesson completion status" };
  }

  await updateLessonCompleteStatusDb({ lessonId, userID, complete });

  return {
    error: false,
    message: "Successfully updated lesson completion status",
  };
}
