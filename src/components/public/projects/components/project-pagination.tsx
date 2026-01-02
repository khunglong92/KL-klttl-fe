import { useTheme } from "@/hooks/useTheme";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProjectPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProjectPaginationProps) {
  const { theme } = useTheme();

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded-lg border disabled:opacity-40 transition-all",
          theme === "dark"
            ? "bg-navy-900 border-navy-700 text-white hover:bg-navy-800"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPageNumbers().map((pageNum, idx) =>
        pageNum === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum as number)}
            className={cn(
              "w-8 h-8 rounded-lg text-sm font-medium transition-all",
              currentPage === pageNum
                ? "bg-amber-500 text-white shadow-md"
                : theme === "dark"
                  ? "bg-navy-900 border border-navy-700 text-white hover:bg-navy-800"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            )}
          >
            {pageNum}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded-lg border disabled:opacity-40 transition-all",
          theme === "dark"
            ? "bg-navy-900 border-navy-700 text-white hover:bg-navy-800"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
