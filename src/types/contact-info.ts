export interface ContactInfo {
  id?: string;
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  googleMapUrl?: string;
  foundingDate?: string;
  companyType?: string;
  aboutUs?: string;
  yearsOfExperience?: number;
  projectsCompleted?: number;
  satisfiedClients?: number;
  satisfactionRate?: number;
  mission?: string;
  vision?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateContactInfoDto = Partial<
  Omit<ContactInfo, "id" | "createdAt" | "updatedAt">
>;
