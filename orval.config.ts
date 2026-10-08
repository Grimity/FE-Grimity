import { defineConfig } from "orval";

export default defineConfig({
  grimity: {
    input: {
      target: "https://raw.githubusercontent.com/Grimity/server/dev/openapi/openapi.json",
    },
    output: {
      mode: "tags-split",
      target: "src/api/generated/api.ts",
      schemas: "src/api/generated/model",
      client: "react-query",
      httpClient: "axios",
      clean: ["!customAxios.ts"],
      override: {
        mutator: {
          path: "src/api/generated/customAxios.ts",
          name: "customAxios",
        },
        operations: {
          user_getFeeds: {
            query: { useInfinite: true, useInfiniteQueryParam: "cursor" },
          },
          me_getMyFollowers: {
            query: { useInfinite: true, useInfiniteQueryParam: "cursor" },
          },
          me_getMyFollowings: {
            query: { useInfinite: true, useInfiniteQueryParam: "cursor" },
          },
        },
      },
    },
  },
});
