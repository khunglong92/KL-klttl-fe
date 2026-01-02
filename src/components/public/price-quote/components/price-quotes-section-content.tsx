import { useEffect, useState } from "react";
import { uploadService } from "@/services/api/uploadService";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface PriceQuoteSectionContentProps {
  contentKey: string;
}

export function PriceQuoteSectionContent({
  contentKey,
}: PriceQuoteSectionContentProps) {
  const [content, setContent] = useState<string>("");
  const { theme } = useTheme();

  useEffect(() => {
    const loadContent = async () => {
      if (!contentKey) return;

      // If it looks like HTML, use it directly
      if (contentKey.trim().startsWith("<")) {
        setContent(contentKey);
        return;
      }

      try {
        // Resolve URL (in case it's a key like 'price-quotes/123/sections/...')
        let url = contentKey;
        if (!url.startsWith("http")) {
          url = await uploadService.getFileUrl(contentKey);
        }

        const res = await fetch(url);
        if (res.ok) {
          const text = await res.text();
          setContent(text);
        }
      } catch (error) {
        console.warn("Failed to load section content:", error);
      }
    };

    loadContent();
  }, [contentKey]);

  if (!content) return null;

  return (
    <div
      className={cn(
        "ql-snow ql-editor max-w-none px-0",
        theme === "dark" ? "text-gray-300" : "text-gray-700"
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
