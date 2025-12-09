import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ContactInfo } from "@/types/contact-info";

interface ContactInfoState {
  companyInfo: ContactInfo | null;
  setCompanyInfo: (info: ContactInfo) => void;
  clearCompanyInfo: () => void;
}

// Zustand store with localStorage persistence for company contact info
export const useContactInfoStore = create<ContactInfoState>()(
  persist(
    (set) => ({
      companyInfo: null,
      setCompanyInfo: (info: ContactInfo) => set({ companyInfo: info }),
      clearCompanyInfo: () => set({ companyInfo: null }),
    }),
    {
      name: "company-info-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        companyInfo: state.companyInfo,
      }),
    }
  )
);

// Convenience selectors to prevent unnecessary re-renders
export const selectCompanyInfo = (s: ContactInfoState) => s.companyInfo;

