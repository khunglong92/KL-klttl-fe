import { apiClient } from "./base";

export type ReviewTargetType =
  | "PRODUCT"
  | "PROJECT"
  | "SERVICE"
  | "NEWS"
  | "RECRUITMENT"
  | "OTHER";

export interface Review {
  id: string;
  name: string;
  email: string;
  content: string;
  rating: number;
  targetType: ReviewTargetType;
  targetId: string;
  createdAt: string;
}

export interface ReviewsResponse {
  data: Review[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateReviewDto {
  name: string;
  email: string;
  content: string;
  rating: number;
  targetType: ReviewTargetType;
  targetId: string;
}

export const reviewsService = {
  findAll: async (params: {
    page?: number;
    limit?: number;
    targetType?: ReviewTargetType;
    targetId?: string;
  }): Promise<ReviewsResponse> => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.targetType) query.append("targetType", params.targetType);
    if (params.targetId) query.append("targetId", params.targetId);
    const url = `reviews${query.toString() ? `?${query.toString()}` : ""}`;
    return apiClient.get<ReviewsResponse>(url);
  },

  create: async (dto: CreateReviewDto): Promise<Review> => {
    return apiClient.post<Review, CreateReviewDto>("reviews", dto);
  },

  remove: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`reviews/${id}`);
  },
};
