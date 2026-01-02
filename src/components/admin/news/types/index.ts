export interface ContentSection {
  title: string;
  description: string;
  image?: string;
}

export interface News {
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

export interface NewsFormData {
  id?: string;
  title: string;
  subtitle?: string;
  image?: string;
  contentSections: ContentSection[];
  isFeatured: boolean;
  isActive: boolean;
  deletedImages?: string[];
}

export interface NewsResponse {
  data: News[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
