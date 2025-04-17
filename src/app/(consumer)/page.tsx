import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { ProductCard } from "@/features/products/components/ProductCard";
import { eq } from "drizzle-orm";

export default async function Home() {
  const publicProducts = await getPublicProduct();
  //console.log(publicProducts);
  return (
    <>
      <div className="m-10 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-10">
        {publicProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </>
  );
}

async function getPublicProduct() {
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
