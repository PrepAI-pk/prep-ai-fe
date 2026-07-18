import { prepaiApi } from "../baseApi";
import type {
  DiagnosticAnswerPayload,
  DiagnosticQuestion,
  OnboardingPatchPayload,
  OnboardingProfileResponse,
} from "./onboarding.types";

export const onboardingApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getOnboarding: builder.query<OnboardingProfileResponse, void>({
      query: () => "/onboarding",
    }),
    patchOnboarding: builder.mutation<OnboardingProfileResponse, OnboardingPatchPayload>({
      query: (body) => ({ url: "/onboarding", method: "PATCH", body }),
    }),
    completeOnboarding: builder.mutation<{ success: true }, void>({
      query: () => ({ url: "/onboarding/complete", method: "POST" }),
      invalidatesTags: ["Me"],
    }),
    skipOnboarding: builder.mutation<{ success: true }, void>({
      query: () => ({ url: "/onboarding/skip", method: "POST" }),
      invalidatesTags: ["Me"],
    }),
    getDiagnostic: builder.query<DiagnosticQuestion[], void>({
      query: () => "/onboarding/diagnostic",
    }),
    submitDiagnostic: builder.mutation<{ success: true }, DiagnosticAnswerPayload>({
      query: (body) => ({ url: "/onboarding/diagnostic", method: "POST", body }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetOnboardingQuery,
  usePatchOnboardingMutation,
  useCompleteOnboardingMutation,
  useSkipOnboardingMutation,
  useGetDiagnosticQuery,
  useSubmitDiagnosticMutation,
} = onboardingApi;
