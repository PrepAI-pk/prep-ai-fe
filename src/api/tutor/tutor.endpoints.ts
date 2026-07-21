import { prepaiApi } from "../baseApi";
import type {
  CreateTutorConversationPayload,
  TutorConversationDetail,
  TutorConversationSummary,
  TutorSuggestionsResponse,
} from "./tutor.types";

export const tutorApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getTutorConversations: builder.query<TutorConversationSummary[], void>({
      query: () => "/tutor/conversations",
      providesTags: ["TutorConversation"],
    }),
    getTutorConversation: builder.query<TutorConversationDetail, string>({
      query: (id) => `/tutor/conversations/${id}`,
      providesTags: (_result, _error, id) => [{ type: "TutorConversation", id }],
    }),
    createTutorConversation: builder.mutation<TutorConversationSummary, CreateTutorConversationPayload | void>({
      query: (body) => ({ url: "/tutor/conversations", method: "POST", body: body ?? {} }),
      invalidatesTags: ["TutorConversation"],
    }),
    deleteTutorConversation: builder.mutation<{ success: true }, string>({
      query: (id) => ({ url: `/tutor/conversations/${id}`, method: "DELETE" }),
      invalidatesTags: ["TutorConversation"],
    }),
    getTutorSuggestions: builder.query<TutorSuggestionsResponse, void>({
      query: () => "/tutor/suggestions",
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetTutorConversationsQuery,
  useGetTutorConversationQuery,
  useCreateTutorConversationMutation,
  useDeleteTutorConversationMutation,
  useGetTutorSuggestionsQuery,
} = tutorApi;
