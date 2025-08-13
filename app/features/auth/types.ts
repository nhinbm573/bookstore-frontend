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

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}

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
