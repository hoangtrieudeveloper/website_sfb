"use client";

import { useRouter, useParams } from "next/navigation";
import ProductForm from "../../ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  return (
    <div className="container mx-auto p-6">
      <ProductForm productId={id} onSuccess={() => router.push("/admin/products")} />
    </div>
  );
}

