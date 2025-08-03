export type PageNumber = number | "...";

export interface GeneratePageNumbers {
  (currentPage: number, totalPages: number): PageNumber[];
}

export const generatePageNumbers: GeneratePageNumbers = (
  currentPage,
  totalPages,
) => {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: PageNumber[] = [];
  pages.push(1);

  if (currentPage <= 3) {
    pages.push(2, 3, 4);
    pages.push("...");
    pages.push(totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push("...");
    for (let i = totalPages - 3; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push("...");
    pages.push(currentPage - 1, currentPage, currentPage + 1);
    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
};
