import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsService, type CreateReviewDto } from "../api/reviewsService";

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ["reviews", "PRODUCT", productId],
    queryFn: () =>
      reviewsService.findAll({
        targetType: "PRODUCT",
        targetId: productId,
        limit: 100,
      }),
    enabled: !!productId,
  });
}

export function useProjectReviews(projectId: string) {
  return useQuery({
    queryKey: ["reviews", "PROJECT", projectId],
    queryFn: () =>
      reviewsService.findAll({
        targetType: "PROJECT",
        targetId: projectId,
        limit: 100,
      }),
    enabled: !!projectId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateReviewDto) => reviewsService.create(dto),
    onSuccess: (_, variables) => {
      // Invalidate reviews query for the target
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.targetType, variables.targetId],
      });
    },
  });
}

export function useServiceReviews(serviceId: string) {
  return useQuery({
    queryKey: ["reviews", "SERVICE", serviceId],
    queryFn: () =>
      reviewsService.findAll({
        targetType: "SERVICE",
        targetId: serviceId,
        limit: 100,
      }),
    enabled: !!serviceId,
  });
}

export function useNewsReviews(
  newsId: string,
  targetType: "NEWS" | "RECRUITMENT" = "NEWS"
) {
  return useQuery({
    queryKey: ["reviews", targetType, newsId],
    queryFn: () =>
      reviewsService.findAll({
        targetType,
        targetId: newsId,
        limit: 100,
      }),
    enabled: !!newsId,
  });
}
