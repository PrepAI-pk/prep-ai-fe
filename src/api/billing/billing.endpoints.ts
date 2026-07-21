import { prepaiApi } from "../baseApi";
import type {
  CheckoutRequest,
  CheckoutResponse,
  ListInvoicesResponse,
  PlansResponse,
  Subscription,
} from "./billing.types";

export const billingApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<PlansResponse, void>({
      query: () => "/plans",
    }),
    getSubscription: builder.query<Subscription, void>({
      query: () => "/subscription",
      providesTags: ["Subscription"],
    }),
    checkout: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({ url: "/subscription/checkout", method: "POST", body }),
      invalidatesTags: ["Subscription", "Invoice"],
    }),
    cancelSubscription: builder.mutation<Subscription, void>({
      query: () => ({ url: "/subscription/cancel", method: "POST" }),
      invalidatesTags: ["Subscription"],
    }),
    getInvoices: builder.query<ListInvoicesResponse, void>({
      query: () => "/invoices",
      providesTags: ["Invoice"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPlansQuery,
  useGetSubscriptionQuery,
  useCheckoutMutation,
  useCancelSubscriptionMutation,
  useGetInvoicesQuery,
} = billingApi;
