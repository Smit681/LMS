import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { PurchaseTable } from "@/drizzle/schema";

import PurchaseHistoryTable, {
  UserPurchaseTableSkeleton,
} from "@/features/purchses/components/PurchaseHistoryTable";
import { getPurchaseUserTag } from "@/features/purchses/db/cache";

import { getCurrentUser } from "@/services/clerk";
import { desc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export default async function purchaseHistory() {
  const { userID } = await getCurrentUser();
  if (!userID) redirect("/sign-in");
  return (
    <div className="px-10 py-6">
      <PageHeader title="Purchase History" />
      <Suspense fallback={<UserPurchaseTableSkeleton />}>
        <SuspenseBoundary />
      </Suspense>
    </div>
  );
}

async function SuspenseBoundary() {
  const { userID, redirectToSignIn } = await getCurrentUser();
  if (userID == null) return redirectToSignIn();

  const purchases = await getPurchases(userID);

  if (purchases.length === 0) {
    return (
      <div className="flex flex-col gap-2 items-start">
        You have made no purchases yet
        <Button asChild size="lg">
          <Link href="/">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  return <PurchaseHistoryTable purchases={purchases} />;
}

async function getPurchases(userID: string) {
  "use cache";
  cacheTag(getPurchaseUserTag(userID));

  return db.query.PurchaseTable.findMany({
    columns: {
      id: true,
      pricePaidInCents: true,
      refundedAt: true,
      productDetails: true,
      createdAt: true,
    },
    where: eq(PurchaseTable.userId, userID),
    orderBy: desc(PurchaseTable.createdAt),
  });
}
