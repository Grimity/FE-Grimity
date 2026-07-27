/**
 * 이미지 URL을 파일로 다운로드한다.
 * 크로스 오리진 이미지는 <a download>만으로는 저장되지 않으므로 blob으로 받아 처리하고,
 * 실패 시 새 탭으로 열어 사용자가 직접 저장하도록 fallback
 */
export async function downloadImage(url: string, filename?: string): Promise<void> {
  const name = filename ?? url.split("/").pop()?.split("?")[0] ?? "image";

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`이미지를 불러오지 못했습니다 (${response.status})`);

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error("이미지 다운로드 실패:", error);
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
