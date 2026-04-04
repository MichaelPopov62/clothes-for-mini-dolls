import { useState } from "react";
import { products } from "@/data/products";
import type { Product } from "@/types";
import AboutSection from "@/components/AboutSection";
import Catalog from "@/components/Catalog";
import ProductModal from "@/components/ProductModal";
import appStyles from "@/App.module.css";

/** Главная: о мастерице, каталог, модалка заказа */
const HomePage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <main className={appStyles.main}>
        <AboutSection />
        <Catalog products={products} onSelectProduct={setSelectedProduct} />
      </main>
      {selectedProduct && (
        <ProductModal
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default HomePage;
