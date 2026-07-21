import type { AuthUser } from "../../store/slices/auth-slice";

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type GoogleAuthPayload = {
  idToken: string;
};

export type AuthSuccessResponse = {
  accessToken: string;
  user: AuthUser;
};

export type RefreshResponse = {
  accessToken: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
