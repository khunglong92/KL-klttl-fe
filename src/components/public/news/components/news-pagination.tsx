import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function NewsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: NewsPaginationProps) {
  const { theme } = useTheme();

  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (showEllipsisStart) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (showEllipsisEnd) pages.push("...");
    if (!pages.includes(totalPages)) pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          theme === "dark"
            ? "bg-[#24262b] text-white hover:bg-[#2d3f5e]"
            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className={cn(
              "px-2",
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            )}
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={cn(
              "min-w-[40px] h-10 rounded-lg font-medium transition-colors",
              currentPage === page
                ? "bg-amber-500 text-white"
                : theme === "dark"
                  ? "bg-[#24262b] text-white hover:bg-[#2d3f5e]"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          theme === "dark"
            ? "bg-[#24262b] text-white hover:bg-[#2d3f5e]"
            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
