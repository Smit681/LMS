import PageHeader from "@/components/PageHeader";
import {
  SkeletonText,
  SkeletonButton,
  SkeletonArray,
} from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import {
  CourseSectionTable,
  LessonTable,
  UserCourseAccessTable,
} from "@/drizzle/schema";
import { getUserCourseAccessUserTag } from "@/features/courses/db/cache/userCourseAccess";
import { getCurrentUser } from "@/services/clerk";
import { asc, desc, eq, or } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import React, { Suspense } from "react";

export default function CoursesPage() {
  return (
    <div className="px-10 py-6">
      <PageHeader title="My Courses" />

      <Suspense fallback={<SkeletonCourseCard />}>
        <CourseGrids />
      </Suspense>
    </div>
  );
}
function SkeletonCourseCard() {
  return (
    <div className="grid custom-grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <SkeletonArray amount={3}>
        <Card>
          <CardHeader>
            <CardTitle>
              <SkeletonText className="w-3/4" />
            </CardTitle>
            <CardDescription>
              <SkeletonText className="w-1/2" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SkeletonText rows={3} />
          </CardContent>
          <CardFooter>
            <SkeletonButton />
          </CardFooter>
        </Card>
      </SkeletonArray>
    </div>
  );
}

async function CourseGrids() {
  const { userID, redirectToSignIn } = await getCurrentUser();
  if (userID == null) redirectToSignIn();
  else {
    const rawCourses = await getCourses(userID);
    const courses = rawCourses.map((item) => {
      const totalLessons = item.course.courseSections.reduce((sum, section) => {
        return sum + (section.lessons?.length || 0);
      }, 0);
      return {
        ...item.course,
        totalLessons,
      };
    });
    return (
      <div className="grid custom-grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>
                Sections: {course.courseSections.length} * Lessons:
                {course.totalLessons}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pb-5">{course.description}</div>
              <Link href={`/courses/${course.id}`}>
                <Button className="hover:cursor-pointer">View Course</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}

async function getCourses(userID: string) {
  "use cache";
  cacheTag(getUserCourseAccessUserTag(userID));
  return db.query.UserCourseAccessTable.findMany({
    columns: {},
    where: eq(UserCourseAccessTable.userId, userID),
    with: {
      course: {
        columns: {
          id: true,
          name: true,
          description: true,
        },
        with: {
          courseSections: {
            columns: {
              id: true,
              name: true,
            },
            where: eq(CourseSectionTable.status, "public"),
            orderBy: desc(CourseSectionTable.order),
            with: {
              lessons: {
                columns: {
                  id: true,
                  name: true,
                  description: true,
                  youtubeVideoId: true,
                  status: true,
                },
                where: or(
                  eq(LessonTable.status, "public"),
                  eq(LessonTable.status, "preview")
                ),
                orderBy: asc(LessonTable.order),
              },
            },
          },
        },
      },
    },
  });
}
