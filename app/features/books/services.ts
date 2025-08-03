import { apiClient } from "apiClient";
import type {
  GetBooksQueryParams,
  GetBooksResponse,
} from "~/features/books/types";

export const getBooks = async (
  params: GetBooksQueryParams,
): Promise<GetBooksResponse> => {
  const { data } = await apiClient.get<GetBooksResponse>("/books", {
    params: {
      page: params.page,
      limit: params.limit,
      category: params.category,
      search: params.search,
    },
  });
  return data;
};
