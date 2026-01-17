import { useEffect, useState } from "react";
import {
  useGetContactInfo,
  useUpdateContactInfo,
} from "@/services/hooks/useContactInfo";
import { toast } from "sonner";
import { ContactFormValues } from "../schema";

// Schema not needed here as validation is handled by form or we assume type safety

export function useContactInfoCrud() {
  const {
    data: contactInfo,
    isLoading: isFetching,
    error,
  } = useGetContactInfo();
  const updateMutation = useUpdateContactInfo();

  const [form, setForm] = useState<ContactFormValues>({
    companyName: "",
    address: "",
    phone: "",
    email: "",
    workingHours: "",
    googleMapUrl: "",
    foundingDate: "",
    companyType: "",
    aboutUs: "",
    yearsOfExperience: 0,
    projectsCompleted: 0,
    satisfiedClients: 0,
    satisfactionRate: 0,
    mission: "",
    vision: "",
    facilitiesIntro: "",
    profileIntro: "",
    coreValuesItems: "",
    coreValuesDescription: "",
    servicesItems: "",
    servicesDescription: "",
    commitmentIntro: "",
  });

  useEffect(() => {
    if (contactInfo) {
      setForm({
        companyName: contactInfo?.companyName || "",
        address: contactInfo?.address || "",
        phone: contactInfo?.phone || "",
        email: contactInfo?.email || "",
        workingHours: contactInfo?.workingHours || "",
        googleMapUrl: contactInfo?.googleMapUrl || "",
        foundingDate: contactInfo.foundingDate || "",
        companyType: contactInfo?.companyType || "",
        aboutUs: contactInfo?.aboutUs || "",
        yearsOfExperience: contactInfo?.yearsOfExperience || 0,
        projectsCompleted: contactInfo?.projectsCompleted || 0,
        satisfiedClients: contactInfo?.satisfiedClients || 0,
        satisfactionRate: contactInfo?.satisfactionRate || 0,
        mission: contactInfo?.mission || "",
        vision: contactInfo?.vision || "",
        facilitiesIntro: contactInfo?.facilitiesIntro || "",
        profileIntro: contactInfo?.profileIntro || "",
        coreValuesItems: contactInfo?.coreValuesItems || "",
        coreValuesDescription: contactInfo?.coreValuesDescription || "",
        servicesItems: contactInfo?.servicesItems || "",
        servicesDescription: contactInfo?.servicesDescription || "",
        commitmentIntro: contactInfo?.commitmentIntro || "",
      });
    }
  }, [contactInfo]);

  const submit = async (formData: ContactFormValues) => {
    // Using manual mapping to ensure type safety if needed, or directly passing formData
    await updateMutation.mutateAsync(formData);
    toast.success("Cập nhật thông tin liên hệ thành công!");
  };

  return {
    form,
    setForm,
    isFetching,
    isSaving: updateMutation.isPending,
    submit,
    error,
    initialData: contactInfo,
  };
}
