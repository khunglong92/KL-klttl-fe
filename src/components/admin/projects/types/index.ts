export interface Project {
  id: string;
  title: string;
  shortDescription?: string;
  detailedDescription?: string;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormData {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  id?: string;
  deletedImages?: string[];
}

export interface CreateProjectDto {
  title: string;
  shortDescription?: string;
  detailedDescription?: string;
  images?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}
