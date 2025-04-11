"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LessonStatus } from "@/drizzle/schema";
import { LessonForm } from "./LessonForm";
import { useState } from "react";

export function LessonFormDialog({
  sections,
  defaultSectionID,
  children,
  lesson,
}: {
  sections: { id: string; name: string }[];
  defaultSectionID?: string;
  children: React.ReactNode;
  lesson?: {
    id: string;
    name: string;
    status: LessonStatus;
    youtubeVideoId: string;
    description: string | null;
    sectionId: string;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex items-center mb-2">
          <DialogTitle>
            {lesson == null ? "New Lesson" : `Edit ${lesson.name}`}
          </DialogTitle>
        </DialogHeader>
        <LessonForm
          sections={sections}
          onSuccess={() => setIsOpen(false)}
          lesson={lesson}
          defaultSectionId={defaultSectionID ?? ""}
        />
      </DialogContent>
    </Dialog>
  );
}
