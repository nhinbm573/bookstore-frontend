import { publicApiClient, authApiClient } from "apiClient";
import type {
  SignupRequest,
  SignupResponse,
  ActivationRequest,
  ActivationResponse,
  SigninRequest,
  SigninResponse,
  RefreshTokenResponse,
} from "./types";

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await publicApiClient.post<SignupResponse>(
    "/accounts/signup/",
    {
      email: data.email,
      password: data.password,
      phone: data.phone,
      fullName: data.fullName,
      birthday: `${data.birthYear}-${data.birthMonth.padStart(2, "0")}-${data.birthDay.padStart(2, "0")}`,
    },
  );
  return response.data;
};

export const activateAccount = async (
  data: ActivationRequest,
): Promise<ActivationResponse> => {
  const response = await publicApiClient.get<ActivationResponse>(
    `/accounts/activate/${data.uidb64}/${data.token}/`,
  );
  return response.data;
};

export const signin = async (data: SigninRequest): Promise<SigninResponse> => {
  const response = await publicApiClient.post<SigninResponse>(
    "/accounts/login/",
    {
      email: data.email,
      password: data.password,
      captcha: data.captchaToken,
    },
  );
  return response.data;
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response =
    await authApiClient.post<RefreshTokenResponse>("/accounts/refresh/");
  return response.data;
};
