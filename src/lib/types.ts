import type { Database } from "@/lib/database.types";
import { resolveProductImages } from "@/lib/catalogImages";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  trending?: boolean;
  recommended?: boolean;
  tags: string[];
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  joinDate: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderRow["status"];
  total: number;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
  }[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    description: row.description,
    images: resolveProductImages(row.slug, row.images),
    category: row.category,
    rating: Number(row.rating),
    reviews: row.review_count,
    inStock: row.in_stock,
    trending: row.trending,
    recommended: row.recommended,
    tags: row.tags ?? [],
    createdAt: row.created_at,
  };
}

export function mapProfile(row: ProfileRow): User {
  return {
    id: row.id,
    name: row.full_name || row.username,
    username: row.username,
    email: row.email,
    avatar: row.avatar_url || "/placeholder.svg",
    joinDate: row.created_at.slice(0, 10),
  };
}

export function mapOrder(
  order: OrderRow,
  items: (OrderItemRow & { product?: ProductRow | null })[]
): Order {
  return {
    id: order.id,
    date: order.created_at.slice(0, 10),
    status: order.status,
    total: Number(order.total),
    items: items.map((item) => ({
      productId: item.product_id,
      productName: item.product?.name ?? "Product",
      productImage: resolveProductImages(
        item.product?.slug ?? "",
        item.product?.images
      )[0],
      quantity: item.quantity,
      price: Number(item.price),
    })),
  };
}
