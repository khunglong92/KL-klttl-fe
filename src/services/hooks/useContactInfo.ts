import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactInfoService } from "@/services/api/contactInfoService";
import type { ContactInfo, UpdateContactInfoDto } from "@/types/contact-info";

const QUERY_KEY = ["contactInfo"];

export function useGetContactInfo() {
  return useQuery<ContactInfo | null, Error>({
    queryKey: QUERY_KEY,
    queryFn: () => contactInfoService.get(),
  });
}

export function useUpdateContactInfo() {
  const queryClient = useQueryClient();

  return useMutation<ContactInfo, Error, UpdateContactInfoDto>({
    mutationFn: (data: UpdateContactInfoDto) => contactInfoService.update(data),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(QUERY_KEY, updatedData);
    },
  });
}
