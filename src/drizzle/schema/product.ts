import { relations } from "drizzle-orm";
import { pgTable, text, integer, pgEnum } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { CourseProductTable } from "./courseProduct";

//creating a read only touple
export const productStatuses = ["public", "private"] as const;

//ProductStatus = "public" | "private"
export type ProductStatus = (typeof productStatuses)[number];
export const productStatusEnum = pgEnum("product_status", productStatuses);

//Defining table named products
export const ProductTable = pgTable("products", {
  id,
  name: text().notNull(),
  description: text().notNull(),
  imageUrl: text().notNull(),
  priceInDollars: integer().notNull(),
  status: productStatusEnum().notNull().default("private"),
  createdAt,
  updatedAt,
});

//Defining relationships for products
//Each product can have many rows in the course_products table.
export const ProductRelationships = relations(ProductTable, ({ many }) => ({
  CourseProductTable: many(CourseProductTable),
}));
