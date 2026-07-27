const PROFILE_ID_REGEX = /^[a-z0-9_]+$/;

const FORBIDDEN_IDS = new Set([
  "popular",
  "board",
  "following",
  "search",
  "write",
  "posts",
  "feeds",
  "mypage",
  "ranking",
  "direct",
]);

export const isValidProfileIdFormat = (profileId: string): boolean => {
  return PROFILE_ID_REGEX.test(profileId);
};

export const isForbiddenProfileId = (profileId: string): boolean => {
  return FORBIDDEN_IDS.has(profileId);
};
