import { useState } from "react";
import { products } from "./data/products";
import type { Product } from "./types";
import Header from "./components/Header";
import AboutSection from "./components/AboutSection";
import Catalog from "./components/Catalog";
import ProductModal from "./components/ProductModal";
import Footer from "./components/Footer";
import styles from "./App.module.css";

const App = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <AboutSection />
        <Catalog products={products} onSelectProduct={setSelectedProduct} />
      </main>
      <Footer />
      {selectedProduct && (
        <ProductModal
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default App;
