import CourseForm from "@/components/CourseForm";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/drizzle/db";
import { CourseSectionTable, CourseTable, LessonTable } from "@/drizzle/schema";
import { getCourseIDTag } from "@/features/courses/db/cache/cache";
import { SectionFormDialog } from "@/features/courseSections/components/SectionFormDialog";
import { SortableSectionList } from "@/features/courseSections/components/SortableSectionList";
import { getCourseSectionCourseTag } from "@/features/courseSections/db/cache";
import { getLessonCourseTag } from "@/features/lessons/db/cache/lessons";

import { asc, eq } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import React from "react";

export default async function CourseEditPage(params: {
  params: Promise<{ courseID: string }>;
}) {
  const { courseID } = await params.params;
  const course = await getCourse(courseID);

  if (!course) {
    return notFound();
  }

  return (
    <div className="p-10">
      <PageHeader title={course?.name}></PageHeader>
      <Tabs defaultValue="Lessons">
        <TabsList className="mb-5">
          <TabsTrigger value="Lessons">Lessons</TabsTrigger>
          <TabsTrigger value="Details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="Lessons">
          <Card>
            <CardHeader className="flex item-center justify-between">
              <CardTitle className="self-center">Sections</CardTitle>
              <SectionFormDialog courseID={courseID}>
                <DialogTrigger asChild>
                  <Button className="hover:cursor-pointer" variant={"outline"}>
                    <PlusIcon /> New Section
                  </Button>
                </DialogTrigger>
              </SectionFormDialog>
            </CardHeader>
            <CardContent>
              <SortableSectionList
                courseId={course.id}
                sections={course.courseSections}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Details">
          <Card>
            <CardHeader>
              <CourseForm course={course} />
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function getCourse(id: string) {
  "use cache";
  cacheTag(
    getCourseIDTag(id),
    getLessonCourseTag(id),
    getCourseSectionCourseTag(id)
  );
  return db.query.CourseTable.findFirst({
    columns: { id: true, name: true, description: true },
    where: eq(CourseTable.id, id),
    with: {
      courseSections: {
        columns: { id: true, name: true, status: true },
        orderBy: asc(CourseSectionTable.order),
        with: {
          lessons: {
            columns: {
              id: true,
              name: true,
              description: true,
              youtubeVideoId: true,
              status: true,
              sectionId: true,
            },
            orderBy: asc(LessonTable.order),
          },
        },
      },
    },
  });
}
