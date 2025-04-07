import {
  pgTable,
  integer,
  jsonb,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { UserTable } from "./user";
import { ProductTable } from "./product";

// Defining table named purchases
export const PurchaseTable = pgTable("purchases", {
  id,
  pricePaidInCents: integer().notNull(),
  productDetails: jsonb()
    .notNull()
    .$type<{ name: string; description: string; imageUrl: string }>(), //this column will store the product details at the time of purchase because the product details may change over time. jasonb is used to store JSON data in PostgreSQL in binary format.
  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "restrict" }),
  productId: uuid()
    .notNull()
    .references(() => ProductTable.id, { onDelete: "restrict" }),
  stripeSessionId: text().notNull().unique(), //stripe is backend + frontend + security layer of payment. It creates a session when a user goes to checkout.
  refundedAt: timestamp({ withTimezone: true }),
  createdAt,
  updatedAt,
});

// Each purchase can relate to one user and one product (one-to-many relationship).
export const PurchaseRelationships = relations(PurchaseTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [PurchaseTable.userId],
    references: [UserTable.id],
  }),
  product: one(ProductTable, {
    fields: [PurchaseTable.productId],
    references: [ProductTable.id],
  }),
}));
