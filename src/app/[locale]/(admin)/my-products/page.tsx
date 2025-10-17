import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import ProductsTable from "@/components/dashboard/ProductsTable";
import { authOptions } from "@/lib/auth";
import Product, { IProduct } from "@/models/Product";

async function getProducts(): Promise<IProduct[]> {
  const products = await Product.find({})
    .populate("category")
    .sort({ createdAt: 1 }) // Order by created_at ascending
    .lean();

  return JSON.parse(JSON.stringify(products));
}

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const products = await getProducts();

  return (
    <div className="p-8 text-text">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ürünlerim</h1>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
