import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config/api";

export const prepaiApi = createApi({
  reducerPath: "prepaiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ["PracticeQuestion", "MockExam"],
  endpoints: () => ({}),
});
