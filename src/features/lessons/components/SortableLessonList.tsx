"use client";

import { SortableItem, SortableList } from "@/components/SortableList";
import { LessonStatus } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { EyeClosedIcon, EyeIcon, Trash2Icon, VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ActionButton";

import { DialogTrigger } from "@/components/ui/dialog";
import { LessonFormDialog } from "./LessonFormDialog";
import { deleteLesson, updateLessonOrders } from "../actions/lessons";

export function SortableLessonList({
  sections,
  lessons,
}: {
  sections: {
    id: string;
    name: string;
  }[];
  lessons: {
    id: string;
    name: string;
    status: LessonStatus;
    youtubeVideoId: string;
    description: string | null;
    sectionId: string;
  }[];
}) {
  return (
    <SortableList items={lessons} onOrderChange={updateLessonOrders}>
      {(items) =>
        items.map((lesson) => (
          <SortableItem
            key={lesson.id}
            id={lesson.id}
            className="flex items-center gap-1"
          >
            <div
              className={cn(
                "mr-auto flex items-center gap-2",
                lesson.status === "private" && "text-muted-foreground"
              )}
            >
              <div>
                {lesson.status === "private" && (
                  <EyeClosedIcon className="size-4" />
                )}
                {lesson.status === "preview" && (
                  <VideoIcon className="size-4" />
                )}
                {lesson.status === "public" && <EyeIcon className="size-4" />}
              </div>
              <div>{lesson.name}</div>
            </div>
            <LessonFormDialog lesson={lesson} sections={sections}>
              <DialogTrigger asChild>
                <Button size="sm">Edit</Button>
              </DialogTrigger>
            </LessonFormDialog>
            <ActionButton
              action={deleteLesson.bind(null, lesson.id)}
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
