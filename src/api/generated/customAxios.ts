import axiosInstance from "@/constants/baseurl";
import type { AxiosRequestConfig } from "axios";

/**
 * orval이 생성한 모든 API 함수가 이 함수를 통해 요청한다.
 * 기존 axiosInstance를 그대로 쓰므로 아래가 전부 유지된다.
 *  - 요청: Bearer 토큰 자동 주입, exclude-access-token 헤더 처리
 *  - 응답: 401 → refresh 후 재시도, is-delete-account 처리
 * 또한 response.data를 벗겨서 반환하므로 호출부는 지금과 동일하게 쓰면 된다.
 */
export const customAxios = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const { data } = await axiosInstance(config);
  return data;
};

export default customAxios;
