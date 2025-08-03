import { apiClient } from "apiClient";
import type { GetCategoriesResponse } from "~/features/categories/types";

export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const { data } = await apiClient.get<GetCategoriesResponse>("/categories");
  return data;
};
