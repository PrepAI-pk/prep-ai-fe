import { prepaiApi } from "../baseApi";
import type {
  AuthSuccessResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  GoogleAuthPayload,
  LoginPayload,
  RefreshResponse,
  RegisterPayload,
  ResetPasswordPayload,
} from "./auth.types";

export const authApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthSuccessResponse, RegisterPayload>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    login: builder.mutation<AuthSuccessResponse, LoginPayload>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    googleAuth: builder.mutation<AuthSuccessResponse, GoogleAuthPayload>({
      query: (body) => ({ url: "/auth/google", method: "POST", body }),
    }),
    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
    }),
    logout: builder.mutation<{ success: true }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    forgotPassword: builder.mutation<{ success: true }, ForgotPasswordPayload>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resetPassword: builder.mutation<{ success: true }, ResetPasswordPayload>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
    changePassword: builder.mutation<{ success: true }, ChangePasswordPayload>({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleAuthMutation,
  useRefreshMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
