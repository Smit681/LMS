import React from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CourseSectionTable,
  LessonTable,
  UserCourseAccessTable,
  CourseTable as DbCourseTable,
} from "@/drizzle/schema";
import { getCourseGlobalTag } from "@/features/courses/db/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import { countDistinct, asc, eq } from "drizzle-orm";
import CourseTable from "@/components/CourseTable";

async function coursePage() {
  const courses = await getCourses();
  return (
    <div className="p-10">
      <PageHeader title="Courses">
        <Button className="hover:cursor-pointer" asChild>
          <Link href="/admin/courses/new">Add Course</Link>
        </Button>
      </PageHeader>
      <CourseTable courses={courses} />
    </div>
  );
}

async function getCourses() {
  "use cache";
  cacheTag(getCourseGlobalTag());

  return db
    .select({
      id: DbCourseTable.id,
      name: DbCourseTable.name,
      sectionsCount: countDistinct(CourseSectionTable),
      lessonsCount: countDistinct(LessonTable),
      studentsCount: countDistinct(UserCourseAccessTable),
    })
    .from(DbCourseTable)
    .leftJoin(
      CourseSectionTable,
      eq(CourseSectionTable.courseId, DbCourseTable.id)
    )
    .leftJoin(LessonTable, eq(LessonTable.sectionId, CourseSectionTable.id))
    .leftJoin(
      UserCourseAccessTable,
      eq(UserCourseAccessTable.courseId, DbCourseTable.id)
    )
    .orderBy(asc(DbCourseTable.name))
    .groupBy(DbCourseTable.id);
}
export default coursePage;
