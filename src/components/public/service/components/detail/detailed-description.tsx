import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";

interface DetailedDescriptionProps {
  url: string;
  title?: string;
}

export function DetailedDescription({ url, title }: DetailedDescriptionProps) {
  const { theme } = useTheme();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const html = await response.text();
        setContent(html);
      } catch (err) {
        console.error("Error fetching detailed description:", err);
        setError("Không thể tải mô tả chi tiết");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [url]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
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
        }
      `}</style>
      {title && (
        <h3
          className={cn(
            "text-xl font-bold mb-4",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}
        >
          {title}
        </h3>
      )}
      <div
        className={cn(
          "ql-snow ql-editor max-w-none",
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        )}
        style={{ padding: 0, lineHeight: 1.8 }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
