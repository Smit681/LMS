import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { ProductCard } from "@/features/products/components/ProductCard";
import { getProductGlobalTag } from "@/features/products/db/cache";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export default async function Home() {
  const publicProducts = await getPublicProduct();
  //console.log(publicProducts);
  return (
    <>
      <div className="m-10 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {publicProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </>
  );
}

async function getPublicProduct() {
  "use cache";
  cacheTag(getProductGlobalTag());
  return db
    .select({
      id: ProductTable.id,
      name: ProductTable.name,
      imageUrl: ProductTable.imageUrl,
      priceInDollars: ProductTable.priceInDollars,
      description: ProductTable.description,
    })
    .from(ProductTable)
    .where(eq(ProductTable.status, "public"));
}
