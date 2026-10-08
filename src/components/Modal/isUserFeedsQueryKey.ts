/** generated `/users/{id}/feeds` 목록 쿼리(일반·infinite 모두)의 키인지 확인한다 */
export const isUserFeedsQueryKey = (queryKey: readonly unknown[]) =>
  queryKey.some((part) => typeof part === "string" && /^\/users\/[^/]+\/feeds$/.test(part));
