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

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}
