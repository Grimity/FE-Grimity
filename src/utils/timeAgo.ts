export function timeAgo(timestamp: string | Date): string {
  try {
    const now = new Date();
    const past = new Date(timestamp);

    if (isNaN(past.getTime())) {
      throw new Error("Invalid timestamp format");
    }

    const diff = (now.getTime() - past.getTime()) / 1000;
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days < 7) {
      if (minutes < 1) {
        return "방금 전";
      } else if (minutes < 60) {
        return `${minutes}분 전`;
      } else if (hours < 24) {
        return `${hours}시간 전`;
      } else {
        return `${days}일 전`;
      }
    } else {
      const year = past.getFullYear();
      const month = String(past.getMonth() + 1).padStart(2, "0");
      const day = String(past.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    }
  } catch (error) {
    console.error("timeAgo error:", error);
    return "시간 계산 오류";
  }
}
