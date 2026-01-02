export interface ContentSection {
  title: string;
  description: string;
  image?: string;
}

export interface PriceQuote {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  contentSections?: ContentSection[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceQuoteFormData {
  id?: string;
  title: string;
  subtitle?: string;
  image?: string;
  contentSections: ContentSection[];
  isFeatured: boolean;
  isActive: boolean;
  deletedImages?: string[];
}

export interface PriceQuotesResponse {
  data: PriceQuote[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
