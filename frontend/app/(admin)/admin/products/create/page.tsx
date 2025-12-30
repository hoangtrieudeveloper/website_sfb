"use client";

import { useRouter } from "next/navigation";
import ProductForm from "../ProductForm";

export default function CreateProductPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <ProductForm onSuccess={() => router.push("/admin/products")} />
    </div>
  );
}

