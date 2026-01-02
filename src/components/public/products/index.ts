export interface ProductCardProps {
  id: string;
  name: string;
  price?: number | string | null | undefined;
  images?: string[] | null | undefined;
  category?: {
    id: number;
    name: string;
  };
  description?: string[] | null;
  detailedDescription?: string | null;
  isFeatured?: boolean;
  showPrice?: boolean;
  index?: number;
  className?: string;
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
}

export interface ParsedDescription {
  overview?: string;
  features?: string[];
  applications?: string[];
  materials?: string[];
}
