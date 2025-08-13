import { publicApiClient } from "apiClient";
import type { GetCategoriesResponse } from "~/features/categories/types";

export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const { data } =
    await publicApiClient.get<GetCategoriesResponse>("/categories");
  return data;
};
