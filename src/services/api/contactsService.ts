import { apiClient } from "./base";

// Based on the NestJS DTO and controller
export interface CreateContactDto {
  name: string;
  email: string;
  phone?: string;
  title?: string;
  address?: string;
  subject?: string;
  content: string;
}

export interface UpdateContactDto {
  isConfirmed: "pending" | "confirmed";
}

// Assuming the API returns the full contact object upon creation
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  title?: string;
  address?: string;
  subject?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isConfirmed?: boolean;
}

export interface PaginatedContactsResponse {
  data: Contact[];
  total: number;
  page: number;
  limit: number;
}

export const contactsService = {
  /**
   * Creates a new contact entry.
   * @param body The data for the new contact.
   * @returns The created contact object.
   */
  create: (body: CreateContactDto) =>
    apiClient.post<Contact>("/contacts", body),

  /**
   * Retrieves a paginated list of contacts.
   * @param page The page number to retrieve.
   * @param limit The number of items per page.
   * @returns A paginated list of contacts.
   */
  findAll: (page: number, limit: number) =>
    apiClient.get<PaginatedContactsResponse>(
      `/contacts?page=${page}&limit=${limit}`
    ),

  /**
   * Updates the status of a specific contact.
   * @param id The ID of the contact to update.
   * @param body The data for updating the contact's status.
   * @returns The updated contact object.
   */
  updateStatus: (id: string, body: UpdateContactDto) =>
    apiClient.patch<Contact>(`/contacts/${id}/status`, body),

  /**
   * Deletes a specific contact.
   * @param id The ID of the contact to delete.
   */
  remove: (id: string) => apiClient.delete<void>(`/contacts/${id}`),
};
