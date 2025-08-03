export interface Pagination {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
