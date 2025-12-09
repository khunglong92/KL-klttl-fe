import { apiClient } from "./base";

// Based on the NestJS DTO and controller
export interface CreateQuoteDto {
  // Customer Information
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  title?: string;

  // Project Information
  projectName: string;
  projectType: string;
  projectDescription: string;
  budget?: string;
  expectedCompletion?: string;

  // Technical Requirements
  technicalRequirements?: string;
  attachmentUrl?: string;

  // Additional Information
  subject?: string;
  content: string;
}

export interface UpdateQuoteDto {
  isConfirmed?: "pending" | "confirmed" | "rejected";
  status?: string;
}

// Assuming the API returns the full quote object upon creation
export interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  title?: string;
  projectName: string;
  projectType: string;
  projectDescription: string;
  budget?: string;
  expectedCompletion?: string;
  technicalRequirements?: string;
  attachmentUrl?: string;
  subject?: string;
  content: string;
  isConfirmed?: boolean;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedQuotesResponse {
  data: Quote[];
  total: number;
  page: number;
  limit: number;
}

export const quotesService = {
  /**
   * Creates a new quote request.
   * @param body The data for the new quote.
   * @returns The created quote object.
   */
  create: (body: CreateQuoteDto) => apiClient.post<Quote>("/quotes", body),

  /**
   * Retrieves a paginated list of quotes.
   * @param page The page number to retrieve.
   * @param limit The number of items per page.
   * @returns A paginated list of quotes.
   */
  findAll: (page: number, limit: number) =>
    apiClient.get<PaginatedQuotesResponse>(
      `/quotes?page=${page}&limit=${limit}`
    ),

  /**
   * Retrieves a specific quote by ID.
   * @param id The ID of the quote to retrieve.
   * @returns The quote object.
   */
  findOne: (id: string) => apiClient.get<Quote>(`/quotes/${id}`),

  /**
   * Updates the status of a specific quote.
   * @param id The ID of the quote to update.
   * @param body The data for updating the quote's status.
   * @returns The updated quote object.
   */
  updateStatus: (id: string, body: UpdateQuoteDto) =>
    apiClient.patch<Quote>(`/quotes/${id}/status`, body),
};
