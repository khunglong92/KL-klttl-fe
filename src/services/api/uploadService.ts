import { apiClient } from "./base";

export interface UploadImageResponse {
  url: string;
  public_id: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
}

export interface UploadFileResponse {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  path: string;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  key: string;
}

export interface FileUrlResponse {
  url: string;
  key: string;
}

export interface MultipleFileUrlsResponse {
  urls: Record<string, string>;
}

/**
 * Check if a value is a MinIO key (not a full URL)
 */
const isMinioKey = (value: string): boolean => {
  return !value.startsWith("http://") && !value.startsWith("https://");
};

/**
 * Extract key from URL (handling MinIO Presigned URLs and Legacy URLs)
 */
export const getKeyFromUrl = (url: string): string => {
  if (!url) return "";
  if (isMinioKey(url)) return url;

  try {
    const urlObj = new URL(url);

    // Legacy URL: /uploads/key
    if (url.includes("/uploads/")) {
      const match = url.match(/\/uploads\/(.+)$/);
      if (match) return match[1] || "";
    }

    // MinIO URL: /bucket/key
    // Remove the first segment (bucket name)
    const parts = urlObj.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return parts.slice(1).join("/");
    }
    return urlObj.pathname.substring(1); // Fallback: remove leading slash
  } catch {
    return url;
  }
};

export const uploadService = {
  /**
   * Get presigned URL for uploading file directly to MinIO
   */
  async getPresignedUploadUrl(
    folder: string,
    filename: string,
    contentType: string,
    options?: { categoryId?: number; entityName?: string }
  ): Promise<PresignedUploadResponse> {
    return apiClient.post<PresignedUploadResponse>("/uploads/presigned-url", {
      folder,
      filename,
      contentType,
      categoryId: options?.categoryId,
      entityName: options?.entityName,
    });
  },

  /**
   * Upload file directly to MinIO using presigned URL
   * Returns the key to store in database
   */
  async uploadToMinio(
    file: File,
    folder: string,
    options?: { categoryId?: number; entityName?: string }
  ): Promise<UploadImageResponse> {
    // 1. Get presigned URL from backend
    const { uploadUrl, key } = await this.getPresignedUploadUrl(
      folder,
      file.name,
      file.type,
      options
    );

    // 2. Upload directly to MinIO
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`MinIO upload failed: ${uploadResponse.statusText}`);
    }

    // 3. Return key (will be stored in database)
    return {
      url: key, // Return key, FE will call getFileUrl to get displayable URL
      public_id: key,
    };
  },

  /**
   * Upload image using legacy endpoint (with watermark support)
   * Falls back to this if MinIO presigned URL fails
   */
  async uploadImageLegacy(
    file: File,
    folder: string
  ): Promise<UploadImageResponse> {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    return apiClient.post<UploadImageResponse, FormData>(
      "/uploads/image",
      form
    );
  },

  /**
   * Upload image - calls backend endpoint to handle watermark
   * Then backend uploads to MinIO
   */
  async uploadImage(file: File, folder: string): Promise<UploadImageResponse> {
    // We must use legacy upload (proxy via backend) to support Watermarking
    // Direct MinIO upload bypasses backend processing (sharp)
    return await this.uploadImageLegacy(file, folder);
  },

  /**
   * Get presigned download URL from key
   */
  async getFileUrl(key: string): Promise<string> {
    // If already a full URL, return as-is
    if (!isMinioKey(key)) {
      return key;
    }

    const response = await apiClient.post<FileUrlResponse>(
      "/uploads/file-url",
      {
        key,
      }
    );
    return response.url;
  },

  /**
   * Get presigned download URLs for multiple keys
   */
  async getMultipleFileUrls(keys: string[]): Promise<Record<string, string>> {
    // Separate full URLs from keys that need resolution
    const fullUrls: Record<string, string> = {};
    const keysToResolve: string[] = [];

    keys.forEach((key) => {
      if (!isMinioKey(key)) {
        fullUrls[key] = key;
      } else {
        keysToResolve.push(key);
      }
    });

    // If all are full URLs, no need to call API
    if (keysToResolve.length === 0) {
      return fullUrls;
    }

    // Get URLs for keys
    const response = await apiClient.post<MultipleFileUrlsResponse>(
      "/uploads/file-urls",
      { keys: keysToResolve }
    );

    return { ...fullUrls, ...response.urls };
  },

  /**
   * Delete image by public_id (key)
   */
  async deleteImage(public_id: string): Promise<void> {
    // Extract key from full URL if needed
    let key = public_id;
    if (!isMinioKey(public_id)) {
      // Extract path after /uploads/
      const match = public_id.match(/\/uploads\/(.+)$/);
      if (match && match[1]) {
        key = match[1];
      }
    }
    return apiClient.delete(`/uploads/image/${key}`);
  },

  /**
   * Upload file for quotes (documents, CAD files, etc.)
   * @param file File to upload
   * @param folder Folder path (e.g., "quote/john-doe")
   * @returns Upload response with file key
   */
  async uploadQuoteFile(
    file: File,
    folder: string
  ): Promise<UploadFileResponse> {
    try {
      const result = await this.uploadToMinio(file, folder);
      // Resolve presigned URL for consistency
      const presignedUrl = await this.getFileUrl(result.public_id);

      return {
        url: presignedUrl,
        filename: result.public_id.split("/").pop() || result.public_id,
        originalName: file.name,
        size: file.size,
        mimetype: file.type,
        path: result.public_id,
      };
    } catch (error) {
      console.warn(
        "MinIO upload failed for quote, falling back to legacy:",
        error
      );
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);

      // Use UploadImageResponse type for the API call
      const res = await apiClient.post<UploadImageResponse, FormData>(
        "/uploads/image",
        form
      );

      return {
        url: res.url, // Backend now returns presigned URL
        filename: res.public_id.split("/").pop() || res.public_id,
        originalName: file.name,
        size: file.size,
        mimetype: file.type,
        path: res.public_id,
      };
    }
  },

  async deleteFile(filename: string): Promise<void> {
    return apiClient.delete(`/uploads/file/${filename}`);
  },
};
