"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseSectionStatus } from "@/drizzle/schema";
import { SectionForm } from "./SectionForm";
import { useState } from "react";

export function SectionFormDialog({
  courseID,
  section,
  children,
}: {
  courseID: string;
  section?: { id: string; name: string; status: CourseSectionStatus };
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent>
        <DialogHeader className="flex items-center mb-2">
          <DialogTitle>
            {section == null ? "New Section" : `Edit ${section.name}`}
          </DialogTitle>
        </DialogHeader>
        <SectionForm
          courseId={courseID}
          section={section}
          onSuccess={() => setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
