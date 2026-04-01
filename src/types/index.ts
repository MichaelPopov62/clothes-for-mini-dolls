import type { Product } from "./product";

export type { Product };

export type CatalogProps = {
  products: Product[];
  onSelectProduct: (product: Product) => void;
};

export type ProductCardProps = {
  product: Product;
  onClick: () => void;
};

export type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

