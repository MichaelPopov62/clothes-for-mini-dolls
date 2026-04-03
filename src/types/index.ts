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

export type ProductOrderFormProps = {
  product: Product;
  onBack: () => void;
  /** Количество (строка для поля ввода) — хранится в модалке, чтобы не терялось при «Назад» */
  quantityText: string;
  onQuantityTextChange: (value: string) => void;
  /** Переход к форме контактов (черновик заказа не сбрасывается) */
  onBuy: () => void;
};

export type ProductCheckoutFormProps = {
  product: Product;
  onBack: () => void;
  clientName: string;
  onClientNameChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  agreed: boolean;
  onAgreedChange: (value: boolean) => void;
  /** После успешной отправки модалка закрывается в родителе; при ошибке — throw или rejected Promise */
  onSubmitOrder: () => void | Promise<void>;
};

