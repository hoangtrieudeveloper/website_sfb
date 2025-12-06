import { ProductsPage } from "../../../pages/ProductsPage";

// Enable ISR - revalidate every 60 seconds for products page
export const revalidate = 60;

export default function ProductsRoute() {
  return <ProductsPage />;
}


