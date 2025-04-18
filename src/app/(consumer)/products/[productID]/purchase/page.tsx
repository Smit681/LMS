import LoadingSpinner from "@/components/LoadingSpinner";
import PageHeader from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { getProductIdTag } from "@/features/products/db/cache";
import { userOwnsProduct } from "@/features/products/db/products";
import { getCurrentUser } from "@/services/clerk";
import StripeCheckoutForm from "@/services/stripe/components/StripeCheckoutForm";
import { SignIn, SignUp } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound, redirect } from "next/navigation";
import React, { Suspense } from "react";

export default function purchasePage({
  params,
  searchParams,
}: {
  params: Promise<{ productID: string }>;
  searchParams: Promise<{ authMode: string }>;
}) {
  return (
    <Suspense fallback={<LoadingSpinner className="size-35 mx-auto my-20" />}>
      <SuspendedComponent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function SuspendedComponent({
  params,
  searchParams,
}: {
  params: Promise<{ productID: string }>;
  searchParams: Promise<{ authMode: string }>;
}) {
  const { productID } = await params;
  const { authMode } = await searchParams;
  const isSignUp = authMode === "signUp";
  const { user } = await getCurrentUser({ allData: true });
  debugger;
  const product = await getPublicProduct({ productID });

  if (product == null) return notFound();

  if (user != null) {
    if (await userOwnsProduct({ userID: user.id, productId: productID })) {
      redirect("/courses");
    } else {
      return (
        <div className="my-6">
          <StripeCheckoutForm product={product} user={user} />
        </div>
      );
    }
  } else {
    return (
      <div className="my-6 flex flex-col items-center">
        <PageHeader title="You need an account to make a purchase." />
        {isSignUp ? (
          <SignUp
            routing="hash"
            signInUrl={`/products/${productID}/purchase?authMode=signIn`}
            forceRedirectUrl={`/products/${productID}/purchase`}
          />
        ) : (
          <SignIn
            routing="hash"
            signUpUrl={`/products/${productID}/purchase?authMode=signUp`}
            forceRedirectUrl={`/products/${productID}/purchase`}
          />
        )}
      </div>
    );
  }

  return null;
}

async function getPublicProduct({ productID }: { productID: string }) {
  "use cache";
  cacheTag(getProductIdTag(productID));
  return db.query.ProductTable.findFirst({
    columns: {
      id: true,
      name: true,
      imageUrl: true,
      priceInDollars: true,
      description: true,
    },
    where: eq(ProductTable.id, productID),
  });
}
