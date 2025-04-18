import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { getProductIdTag } from "@/features/products/db/cache";
import { wherePublicProducts } from "@/features/products/permissions/products";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Image from "next/image";
import Link from "next/link";

export default async function ProductPurchaseSuccessPage({
  params,
}: {
  params: Promise<{ productID: string }>;
}) {
  const { productID } = await params;
  const product = await getPublicProduct(productID);

  if (product == null) return;

  return (
    <div className="py-10 px-10 md:px-20 lg:px-25">
      <div className="flex lg:justify-between flex-wrap-reverse justify-center gap-16">
        <div className="flex flex-col gap-4 items-start">
          <div className="text-3xl font-semibold">Purchase Successful</div>
          <div className="text-xl">
            Thank you for purchasing {product.name}.
          </div>
          <Button asChild className="text-xl h-auto py-4 px-8 rounded-lg">
            <Link href="/courses">View My Courses</Link>
          </Button>
        </div>
        <div className="relative aspect-video sm:max-w-md max-w-[200px] min-w-sm flex-grow">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

async function getPublicProduct(id: string) {
  "use cache";
  cacheTag(getProductIdTag(id));

  return db.query.ProductTable.findFirst({
    columns: {
      name: true,
      imageUrl: true,
    },
    where: and(eq(ProductTable.id, id), wherePublicProducts),
  });
}
