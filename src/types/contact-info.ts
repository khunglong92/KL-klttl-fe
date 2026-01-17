export interface ContactInfo {
  id?: string;
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  googleMapUrl?: string | null;
  foundingDate?: string | null;
  companyType?: string | null;
  aboutUs?: string | null;
  yearsOfExperience?: number | null;
  projectsCompleted?: number | null;
  satisfiedClients?: number | null;
  satisfactionRate?: number | null;
  mission?: string | null;
  vision?: string | null;
  facilitiesIntro?: string | null;
  profileIntro?: string | null;
  coreValuesItems?: string | null;
  coreValuesDescription?: string | null;
  servicesItems?: string | null;
  servicesDescription?: string | null;
  commitmentIntro?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateContactInfoDto = Partial<
  Omit<ContactInfo, "id" | "createdAt" | "updatedAt">
>;
