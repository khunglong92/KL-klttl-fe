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

  try {
    // Attempt to parse the URL. This works for absolute URLs.
    const urlObject = new URL(url);

    // Split the pathname and filter out empty segments (from leading/trailing slashes)
    const pathSegments = urlObject.pathname.split('/').filter(Boolean);

    // Find the index of a known directory ('products', 'projects', etc.)
    // This makes the function robust to different hostnames and base paths.
    const knownDirectories = [
      "products", "projects", "services", "posts",
      "users", "avatars", "banners", "categories", "quotes", "general"
    ];

    let keyStartIndex = -1;
    for (const dir of knownDirectories) {
      const index = pathSegments.indexOf(dir);
      if (index !== -1) {
        keyStartIndex = index;
        break;
      }
    }

    // If a known directory is found, the key is the rest of the path.
    if (keyStartIndex !== -1) {
      return pathSegments.slice(keyStartIndex).join('/');
    }

    // Fallback for URLs where the structure is /bucket/key/...
    // Assumes the first segment is the bucket name.
    if (pathSegments.length > 1) {
      return pathSegments.slice(1).join('/');
    }

    // If all else fails, return the full pathname minus the leading slash.
    return urlObject.pathname.substring(1);

  } catch {
    // If the URL is not absolute (e.g., it's already a key like "products/1/image.jpg"),
    // the constructor will throw. In this case, we assume the input is the key.
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
    const key = getKeyFromUrl(public_id);
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
