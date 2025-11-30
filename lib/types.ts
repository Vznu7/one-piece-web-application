export type Size = "XS" | "S" | "M" | "L" | "XL";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  sizes: Size[];
  inStock: boolean;
  tags?: string[];
  color?: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  size: Size;
  quantity: number;
}

export type OrderStatus = "placed" | "packed" | "shipped" | "delivered";

export interface Address {
  id: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  size: Size;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: "upi" | "card" | "cod";
  subtotal: number;
  shipping: number;
  total: number;
  estimatedDelivery: string;
}
