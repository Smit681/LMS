"use client";

import { SortableItem, SortableList } from "@/components/SortableList";
import { CourseSectionStatus } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { EyeClosedIcon, EyeIcon, Trash2Icon } from "lucide-react";
import { SectionFormDialog } from "./SectionFormDialog";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ActionButton";
import { deleteSection, updateSectionOrders } from "../actions/sections";
import { DialogTrigger } from "@/components/ui/dialog";

export function SortableSectionList({
  courseId,
  sections,
}: {
  courseId: string;
  sections: {
    id: string;
    name: string;
    status: CourseSectionStatus;
  }[];
}) {
  return (
    <SortableList items={sections} onOrderChange={updateSectionOrders}>
      {(items) =>
        items.map((section) => (
          <SortableItem
            key={section.id}
            id={section.id}
            className="flex items-center gap-1"
          >
            <div
              className={cn(
                "mr-auto flex items-center gap-2",
                section.status === "private" && "text-muted-foreground"
              )}
            >
              <div>
                {section.status === "private" && (
                  <EyeClosedIcon className="size-4" />
                )}
                {section.status === "public" && <EyeIcon className="size-4" />}
              </div>
              <div>{section.name}</div>
            </div>
            <SectionFormDialog section={section} courseID={courseId}>
              <DialogTrigger asChild>
                <Button size="sm">Edit</Button>
              </DialogTrigger>
            </SectionFormDialog>
            <ActionButton
              action={deleteSection.bind(null, section.id)}
              requireAreYouSure
              size="sm"
              variant="outline"
              className="border-red-500"
            >
              <Trash2Icon className=" text-red-500" />
              <span className="sr-only">Delete</span>
            </ActionButton>
          </SortableItem>
        ))
      }
    </SortableList>
  );
}
