// SIGNUP API TYPES

export interface SignupRequest {
  email: string;
  password: string;
  phone: string;
  fullName: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
}

export interface SignupResponse {
  message: string;
  status: number;
}

// ACTIVATION API TYPES

export interface ActivationRequest {
  uidb64: string;
  token: string;
}

export interface ActivationResponse {
  message: string;
  status: number;
}

// SIGNIN API TYPES

export interface SigninRequest {
  email: string;
  password: string;
  captchaToken?: string;
}

export interface SigninAccount {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  birthday: string;
  isGoogleUser?: boolean;
}

export interface SigninResponse {
  message: string;
  status: number;
  data: {
    access: string;
    account: SigninAccount;
  };
}

export interface SigninError {
  message: string;
  status: number;
  captchaRequired?: boolean;
}

// REFRESH TOKEN API TYPES

export interface RefreshTokenResponse {
  access: string;
  account: SigninAccount;
}

// GOOGLE SIGNIN API TYPES

export interface GoogleSigninRequest {
  credential: string;
}

export interface SignoutResponse {
  message: string;
  status: number;
}

// RETRIEVE PASSWORD API TYPES

export interface RetrievePasswordRequest {
  email: string;
}

export interface RetrievePasswordResponse {
  message: string;
  status: number;
}

export interface ResetPasswordRequest {
  uidb64: string;
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  status: number;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  birthday: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// UPDATE USER API TYPES

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  oldPassword?: string;
  newPassword?: string;
}

export interface UpdateUserResponse {
  message: string;
  status: number;
  data?: {
    account: SigninAccount;
  };
}
