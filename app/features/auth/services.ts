import { apiClient } from "apiClient";
import type { SignupRequest, SignupResponse } from "./types";

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await apiClient.post<SignupResponse>("/accounts/signup/", {
    email: data.email,
    password: data.password,
    phone: data.phone,
    fullName: data.fullName,
    birthday: `${data.birthYear}-${data.birthMonth.padStart(2, "0")}-${data.birthDay.padStart(2, "0")}`,
  });
  return response.data;
};
