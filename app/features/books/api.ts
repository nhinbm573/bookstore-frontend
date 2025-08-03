import { useQuery } from "@tanstack/react-query";
import { getBooks } from "~/features/books/services";
import type { GetBooksQueryParams } from "~/features/books/types";

export const useBooks = (params: GetBooksQueryParams = {}) => {
  return useQuery({
    queryKey: ["books", params],
    queryFn: () => getBooks(params),
    staleTime: 5 * 60 * 1000,
  });
};
