export interface ContentSection {
  title: string;
  description: string;
  image?: string;
}

export interface Recruitment {
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

export interface RecruitmentFormData {
  id?: string;
  title: string;
  subtitle?: string;
  image?: string;
  contentSections: ContentSection[];
  isFeatured: boolean;
  isActive: boolean;
  deletedImages?: string[];
}

export interface RecruitmentResponse {
  data: Recruitment[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
