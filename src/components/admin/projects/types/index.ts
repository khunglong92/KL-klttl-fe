export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export interface Project {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  content?: string;
  location?: string;
  completionDate?: string;
  image?: string;
  gallery?: string[] | null;
  isFeatured: boolean;
  isActive: boolean;
}

export interface FormData {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  location: string;
  completionDate?: string;
  image: string;
  gallery: string[] | null;
  isFeatured: boolean;
  isActive: boolean;
}

export interface CreateProjectCategoryDto {
  name: string;
  slug: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateProjectCategoryDto
  extends Partial<CreateProjectCategoryDto> {}

export interface CreateProjectDto {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  content?: string;
  location?: string;
  completionDate?: string;
  image?: string;
  gallery?: any;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}
