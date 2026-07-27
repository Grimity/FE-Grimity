export interface ShareModalProps {
  /** 모달 타이틀. 예: "그림 공유", "글 공유", "프로필 공유" */
  shareTitle: string;
  /** 공유할 URL */
  url: string;
  /** 카카오 공유 설명 텍스트 */
  kakaoDescription: string;
  /** 카카오 공유 썸네일 이미지 URL */
  kakaoImageUrl: string;
  /** X(트위터) 공유 문구 */
  twitterText: string;
  onClose: () => void;
}
