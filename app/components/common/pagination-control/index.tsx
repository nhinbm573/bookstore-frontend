import { useScreenSize } from "hooks/use-screen-size";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Pagination } from "~/types";
import { generatePageNumbers } from "~/utils/generate-page-numbers";

export const DEFAULT_ITEMS_PER_PAGE = "10";
export const ITEMS_PER_PAGE_OPTIONS = ["10", "20", "30", "40"];

interface PaginationControlProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: string) => void;
}

export function PaginationControl({
  pagination,
  onPageChange,
  onItemsPerPageChange,
}: PaginationControlProps) {
  const { isMobile } = useScreenSize();

  return (
    <div className="flex items-center justify-between border-t pt-4 gap-4">
      {!isMobile && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Items/page</span>
          <Select
            defaultValue={pagination.limit.toString()}
            onValueChange={onItemsPerPageChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center m-auto sm:m-0">
        <Button
          variant="ghost"
          size="sm"
          className="text-sky-500 text-xs sm:text-sm px-2 sm:px-3"
          onClick={() => onPageChange(1)}
          disabled={pagination.currentPage === 1}
        >
          First
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-sky-500 text-xs sm:text-sm px-2 sm:px-3"
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
        >
          Pre
        </Button>

        {generatePageNumbers(pagination.currentPage, pagination.totalPages).map(
          (page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="text-gray-400 text-xs sm:text-sm"
                >
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                data-slot={`select-page-button-${page}`}
                variant={pagination.currentPage === page ? "default" : "ghost"}
                size="sm"
                className={
                  pagination.currentPage === page
                    ? "bg-sky-500 text-white text-xs sm:text-sm px-2 sm:px-3"
                    : "text-sky-500 text-xs sm:text-sm px-2 sm:px-3"
                }
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          },
        )}

        <Button
          variant="ghost"
          size="sm"
          className="text-sky-500 text-xs sm:text-sm px-2 sm:px-3"
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-sky-500 text-xs sm:text-sm px-2 sm:px-3"
          onClick={() => onPageChange(pagination.totalPages)}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Last
        </Button>
      </div>
    </div>
  );
}
