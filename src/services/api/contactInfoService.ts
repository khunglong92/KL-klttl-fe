import { apiClient } from "./base";
import type { ContactInfo, UpdateContactInfoDto } from "@/types/contact-info";

const CONTACT_INFO_ENDPOINT = "contact-info";

export const contactInfoService = {
  get: async (): Promise<ContactInfo | null> => {
    const data = await apiClient.get<ContactInfo>(CONTACT_INFO_ENDPOINT);
    return data ?? null;
  },

  update: (data: UpdateContactInfoDto): Promise<ContactInfo> => {
    return apiClient.put(CONTACT_INFO_ENDPOINT, data);
  },
};
