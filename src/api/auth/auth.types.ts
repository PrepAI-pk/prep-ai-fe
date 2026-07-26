import type { AuthUser } from "../../store/slices/auth-slice";

export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
export type OtpChannel = "EMAIL" | "SMS" | "BOTH";

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  gender?: Gender;
  otpChannel?: OtpChannel;
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
  // Only populated outside production, when no email/SMS provider is
  // configured — lets the flow be completed without either.
  devOtp?: string;
};

export type RefreshResponse = {
  accessToken: string;
};

export type VerifyEmailPayload = {
  email: string;
  code: string;
};

export type ResendVerificationPayload = {
  email: string;
  channel?: OtpChannel;
};

export type ForgotPasswordPayload = {
  email: string;
  channel?: OtpChannel;
};

export type ResetPasswordPayload = {
  email: string;
  code: string;
  newPassword: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
