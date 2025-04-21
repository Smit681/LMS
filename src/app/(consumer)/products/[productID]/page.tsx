import { db } from "@/drizzle/db";
import { validate as isValidUUID } from "uuid";

import {
  CourseSectionTable,
  LessonTable,
  ProductTable,
} from "@/drizzle/schema";
import { and, asc, eq, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPlural } from "@/lib/formatters";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { VideoIcon } from "lucide-react";
import Link from "next/link";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getProductIdTag } from "@/features/products/db/cache";
import { getLessonCourseTag } from "@/features/lessons/db/cache/lessons";
import { getCourseSectionCourseTag } from "@/features/courseSections/db/cache";
import { getCourseIDTag } from "@/features/courses/db/cache/cache";
import { Suspense } from "react";
import { getCurrentUser } from "@/services/clerk";
import { userOwnsProduct } from "@/features/products/db/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productID: string }>;
}) {
  const { productID } = await params;
  const product = await getProductDetails(productID);
  if (product == null) {
    redirect("/");
  }
  let countlesson = 0;
  product.CourseProductTable.map((course) => {
    course.course.courseSections.map((section) => {
      countlesson += section.lessons.length;
    });
  });
  return (
    <div className="py-10 px-10 md:px-20 lg:px-25 ">
      <div className="flex lg:justify-between flex-wrap-reverse justify-center">
        <div>
          <div className="text-4xl font-semibold my-2"> {product.name} </div>
          <div className="text-muted-foreground mb-4">
            <span>{product.CourseProductTable.length} courses * </span>
            <span>{countlesson} Lessons</span>
          </div>
          <div className="mb-4 text-xl">{product.description}</div>
          <Suspense>
            <PurchaseButton
              productId={product.id}
              cost={product.priceInDollars}
            />
          </Suspense>
        </div>
        <div className="relative aspect-video sm:max-w-md max-w-[200px] min-w-sm flex-grow">
          <Image
            src={product.imageUrl}
            fill
            alt={product.name}
            className="object-contain rounded-xl"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 items-start">
        {product.CourseProductTable.map((course) => (
          <Card key={course.course.id}>
            <CardHeader>
              <CardTitle>{course.course.name}</CardTitle>
              <CardDescription>
                {formatPlural(course.course.courseSections.length, {
                  plural: "sections",
                  singular: "section",
                })}{" "}
                •{" "}
                {formatPlural(
                  sumArray(
                    course.course.courseSections,
                    (s) => s.lessons.length
                  ),
                  {
                    plural: "lessons",
                    singular: "lesson",
                  }
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple">
                {course.course.courseSections.map((section) => (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="flex gap-2">
                      <div className="flex flex-col flex-grow">
                        <span className="text-lg">{section.name}</span>
                        <span className="text-muted-foreground">
                          {formatPlural(section.lessons.length, {
                            plural: "lessons",
                            singular: "lesson",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                      {section.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-2 text-base"
                        >
                          <VideoIcon className="size-4" />
                          {lesson.status === "preview" ? (
                            <Link
                              href={`/courses/${course.course.id}/lessons/${lesson.id}`}
                              className="underline text-accent"
                            >
                              {lesson.name}
                            </Link>
                          ) : (
                            lesson.name
                          )}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

async function PurchaseButton({
  productId,
  cost,
}: {
  productId: string;
  cost: number;
}) {
  const { userID } = await getCurrentUser();
  const alreadyOwnsProduct =
    userID != null && (await userOwnsProduct({ userID, productId }));
  if (alreadyOwnsProduct) {
    return <p>You already own this product</p>;
  } else {
    return (
      <Button className="text-xl h-auto py-3 px-6 rounded-lg" asChild>
        <Link href={`/products/${productId}/purchase`}>Get Now ${cost}</Link>
      </Button>
    );
  }
}

function sumArray<T>(array: T[], func: (item: T) => number) {
  return array.reduce((acc, item) => acc + func(item), 0);
}

async function getProductDetails(id: string) {
  "use cache";
  cacheTag(getProductIdTag(id));
  if (!isValidUUID(id)) {
    return null;
  }
  const product = await db.query.ProductTable.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      priceInDollars: true,
      imageUrl: true,
    },
    where: and(eq(ProductTable.id, id), eq(ProductTable.status, "public")),
    with: {
      CourseProductTable: {
        columns: {
          courseId: true,
        },
        with: {
          course: {
            columns: {
              id: true,
              name: true,
            },
            with: {
              courseSections: {
                columns: {
                  id: true,
                  name: true,
                },
                where: eq(CourseSectionTable.status, "public"),
                orderBy: asc(CourseSectionTable.order),
                with: {
                  lessons: {
                    columns: {
                      id: true,
                      name: true,
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
      },
    },
  });

  if (product == null) return product;

  cacheTag(
    ...product.CourseProductTable.flatMap((cp) => [
      getLessonCourseTag(cp.course.id),
      getCourseSectionCourseTag(cp.course.id),
      getCourseIDTag(cp.course.id),
    ])
  );
  return product;
}
