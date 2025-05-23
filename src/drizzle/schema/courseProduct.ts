import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { CourseTable } from "./course";
import { ProductTable } from "./product";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";

//In Drizzle ORM, we cannot define a many-to-many relationship directly. Instead, we create a join table that contains the foreign keys of the two tables we want to relate.

//Defining table named course_products. The table has two foreign keys: courseId and productId. Primary key is a composite key of courseId and productId.
export const CourseProductTable = pgTable(
  "course_products",
  {
    courseId: uuid()
      .notNull()
      .references(() => CourseTable.id, { onDelete: "restrict" }), // When a course is deleted, the course_products rows will not be deleted. This is to prevent accidental deletion of products associated with a course.
    productId: uuid()
      .notNull()
      .references(() => ProductTable.id, { onDelete: "cascade" }), // When a product is deleted, the course_products rows with that product ID will be deleted.
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.courseId, t.productId] })]
);

//each row of the course_products table relates to one row in the courses table and one row in the products table (many-to-one relationship).
export const CourseProductRelationships = relations(
  CourseProductTable,
  ({ one }) => ({
    course: one(CourseTable, {
      fields: [CourseProductTable.courseId],
      references: [CourseTable.id],
    }),
    product: one(ProductTable, {
      fields: [CourseProductTable.productId],
      references: [ProductTable.id],
    }),
  })
);
