import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import { uploadService } from "@/services/api/uploadService";

interface NewsSectionContentProps {
  contentKey: string;
}

export function NewsSectionContent({ contentKey }: NewsSectionContentProps) {
  const { theme } = useTheme();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contentKey) {
      setLoading(false);
      return;
    }

    // Check if it's already HTML content (starts with <)
    // Legacy support or fallback
    if (contentKey.trim().startsWith("<")) {
      setContent(contentKey);
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Resolve URL from Key
        let url = contentKey;
        if (!url.startsWith("http")) {
          url = await uploadService.getFileUrl(contentKey);
        }

        // 2. Fetch Content
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const html = await response.text();
        setContent(html);
      } catch (err) {
        console.error("Error fetching section content:", err);
        // Fallback: display key if fetch fails? No, display error or nothing.
        // Maybe it's plain text?
        // If fetch fails, checking if it's plain text might be risky if it was a valid 404 URL.
        // Assuming keys are always valid files.
        setError("Không thể tải nội dung");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !content) {
    return null;
  }

  return (
    <div>
      <style>{`
        .ql-align-center {
          text-align: center !important;
        }
        .ql-align-center img {
          display: block !important;
          margin: 0 auto !important;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
        .ql-editor {
           padding: 0;
           line-height: 1.8;
           font-family: inherit;
        }
        /* Prose overrides for Quill */
        .prose .ql-editor h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
        .prose .ql-editor h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
        .prose .ql-editor h3 { font-size: 1.17em; font-weight: bold; margin-bottom: 0.5em; }
        .prose .ql-editor p { margin-bottom: 1em; }
        .prose .ql-editor ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .prose .ql-editor ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
      `}</style>

      <div
        className={cn(
          "ql-snow ql-editor max-w-none",
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
