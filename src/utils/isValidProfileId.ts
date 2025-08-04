export const isValidProfileIdFormat = (profileId: string): boolean => {
  const regex = /^[a-z0-9_]+$/;
  return regex.test(profileId);
};

export const isForbiddenProfileId = (profileId: string): boolean => {
  const forbiddenIds = [
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
  ];
  return forbiddenIds.includes(profileId);
};
