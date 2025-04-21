import PageHeader from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { PurchaseTable } from "@/drizzle/schema";
import SalesTable, {
  SalesTableSkeleton,
} from "@/features/purchses/components/SalesTable";
import { desc } from "drizzle-orm";
import React, { Suspense } from "react";

export default function sales() {
  return (
    <div className="px-10 py-6">
      <PageHeader title="Sales" />
      <Suspense fallback={<SalesTableSkeleton />}>
        <SuspenseBoundary />
      </Suspense>
    </div>
  );
}

async function SuspenseBoundary() {
  const purchases = await getPurchases();
  return <SalesTable purchases={purchases} />;
}

async function getPurchases() {
  return db.query.PurchaseTable.findMany({
    columns: {
      id: true,
      pricePaidInCents: true,
      productDetails: true,
      createdAt: true,
      refundedAt: true,
    },
    orderBy: desc(PurchaseTable.createdAt),
    with: {
      user: {
        columns: {
          name: true,
        },
      },
    },
  });
}
