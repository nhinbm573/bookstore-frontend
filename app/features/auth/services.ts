import { publicApiClient, authApiClient, privateApiClient } from "apiClient";
import type {
  SignupRequest,
  SignupResponse,
  ActivationRequest,
  ActivationResponse,
  SigninRequest,
  SigninResponse,
  RefreshTokenResponse,
  GoogleSigninRequest,
  SignoutResponse,
  RetrievePasswordResponse,
  RetrievePasswordRequest,
  ResetPasswordResponse,
  ResetPasswordRequest,
  UpdateUserRequest,
  UpdateUserResponse,
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

export const googleSignin = async (
  data: GoogleSigninRequest,
): Promise<SigninResponse> => {
  const response = await publicApiClient.post<SigninResponse>(
    "/accounts/google/",
    {
      credential: data.credential,
    },
  );
  return response.data;
};

export const signout = async (): Promise<SignoutResponse> => {
  const response =
    await privateApiClient.post<SignoutResponse>("/accounts/logout/");
  return response.data;
};

export const retrievePassword = async (
  data: RetrievePasswordRequest,
): Promise<RetrievePasswordResponse> => {
  const response = await privateApiClient.post<RetrievePasswordResponse>(
    "/accounts/retrieve-password/",
    {
      email: data.email,
    },
  );
  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  const response = await privateApiClient.post<ResetPasswordResponse>(
    "/accounts/reset-password/",
    {
      uidb64: data.uidb64,
      token: data.token,
      newPassword: data.newPassword,
    },
  );
  return response.data;
};

export const updateUser = async (
  data: UpdateUserRequest,
): Promise<UpdateUserResponse> => {
  const response = await privateApiClient.patch<UpdateUserResponse>(
    "/accounts/me/edit/",
    data,
  );
  return response.data;
};
