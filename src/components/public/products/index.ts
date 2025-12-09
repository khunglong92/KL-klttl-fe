import type { ProductDescription } from "@/services/api/productsService";

export interface ProductCardProps {
  id: number;
  name: string;
  price: number | null | undefined;
  images: string[] | string;
  category?: {
    id: number;
    name: string;
  };
  description?: string | ProductDescription | Record<string, unknown> | null;
  warrantyPolicy?: string | null;
  stock?: number | null | undefined;
  index?: number;
  className?: string;
  onAddToCart?: (productId: number) => void;
  onToggleFavorite?: (productId: number) => void;
}

export interface ParsedDescription {
  overview?: string;
  features?: string[];
  applications?: string[];
  materials?: string[];
}
