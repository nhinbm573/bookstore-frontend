// API

import type { Pagination } from "~/types";

export interface GetBooksQueryParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface GetBooksResponse {
  data: OverallBook[];
  pagination: Pagination;
  status: number;
}

// DATA

export interface OverallBook {
  id: number;
  title: string;
  authorName: string;
  unitPrice: number;
  photoPath: string;
  totalRatingValue: number;
  totalRatingCount: number;
}
