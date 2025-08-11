import { apiClient } from "apiClient";
import type {
  SignupRequest,
  SignupResponse,
  ActivationRequest,
  ActivationResponse,
} from "./types";

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

export const activateAccount = async (
  data: ActivationRequest,
): Promise<ActivationResponse> => {
  const response = await apiClient.get<ActivationResponse>(
    `/accounts/activate/${data.uidb64}/${data.token}/`,
  );
  return response.data;
};
