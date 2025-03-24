import styles from "./Profile.module.scss";
import Button from "../../Button/Button";
import { useMyData } from "@/api/users/getMe";
import Image from "next/image";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRecoilState, useRecoilValue } from "recoil";
import { ProfileProps } from "./Profile.types";
// import { useUserData } from "@/api/users/getId";
import { useUserDataByUrl } from "@/api/users/getId";
import { deleteFollow } from "@/api/users/deleteIdFollow";
import { putFollow } from "@/api/users/putIdFollow";
import { useToast } from "@/hooks/useToast";
import { authState } from "@/states/authState";
import IconComponent from "@/components/Asset/Icon";
import { modalState } from "@/states/modalState";
import { useEffect, useState } from "react";
import router, { useRouter } from "next/router";
import { postPresignedUrl } from "@/api/aws/postPresigned";
import { useMutation } from "react-query";
import { putBackgroundImage, putProfileImage } from "@/api/users/putMeImage";
import { AxiosError } from "axios";
import { deleteMyBackgroundImage, deleteMyProfileImage } from "@/api/users/deleteMeImage";
import Dropdown from "@/components/Dropdown/Dropdown";
import { isMobileState, isTabletState } from "@/states/isMobileState";
import { useIsMobile } from "@/hooks/useIsMobile";
import { deleteMe } from "@/api/users/deleteMe";

export default function Profile({ isMyProfile, id, url }: ProfileProps) {
  const { isLoggedIn, user_id } = useRecoilValue(authState);
  const [, setAuth] = useRecoilState(authState);
  const [, setModal] = useRecoilState(modalState);
  // TODO
  const { data: myData, refetch } = useMyData();
  // const { data: userData, refetch: refetchUserData } = useUserData(id);
  const { data: userData, refetch: refetchUserData } = useUserDataByUrl(url);
  const [profileImage, setProfileImage] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const { showToast } = useToast();
  const isMobile = useRecoilValue(isMobileState);
  const isTablet = useRecoilValue(isTabletState);
  useIsMobile();
  const CoverImageMutation = useMutation((imageName: string) => putBackgroundImage(imageName));
  const { pathname } = useRouter();
  useEffect(() => {
    refetchUserData();
  }, [pathname]);

  useEffect(() => {
    if (url === myData?.url) {
      setProfileImage(myData.image || "/image/default.svg");
      setCoverImage(myData.backgroundImage || "/image/default-cover.png");
    } else if (url === userData?.id) {
      setProfileImage(userData.image || "/image/default.svg");
      setCoverImage(userData.backgroundImage || "/image/default-cover.png");
    }
  }, [url, myData, userData]);

  useEffect(() => {
    setProfileImage(userData?.image || "/image/default.svg");
  }, [userData]);

  const handleFollowClick = async () => {
    try {
      await putFollow(id);
      refetchUserData();
    } catch (error) {
      showToast("로그인 후 가능합니다.", "warning");
    }
  };

  const handleUnfollowClick = async () => {
    try {
      await deleteFollow(id);
      refetchUserData();
    } catch (error) {
      showToast("로그인 후 가능합니다.", "warning");
    }
  };

  const handleOpenEditModal = () => {
    if (isMobile) {
      setModal({ isOpen: true, type: "PROFILE-EDIT", data: null, isFill: true });
    } else {
      setModal({ isOpen: true, type: "PROFILE-EDIT", data: null });
    }
  };

  const ImageMutation = useMutation((imageName: string) => putProfileImage(imageName));

  const uploadImageToServer = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase();

      if (!fileExt || !["jpg", "jpeg", "png", "webp"].includes(fileExt)) {
        showToast("JPG, JPEG, PNG, WEBP 파일만 업로드 가능합니다.", "error");
        return;
      }

      let webpFile = file;
      if (fileExt !== "webp") {
        webpFile = await convertToWebP(file);
      }

      const data = await postPresignedUrl({
        type: "profile",
        ext: "webp",
      });

      ImageMutation.mutate(data.imageName);

      const uploadResponse = await fetch(data.url, {
        method: "PUT",
        body: webpFile,
        headers: {
          "Content-Type": "image/webp",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`${uploadResponse.status}`);
      }

      showToast("프로필 사진이 변경되었습니다!", "success");
      setProfileImage(userData?.image || "/image/default.svg");
      refetchUserData();
    } catch (error) {
      showToast("프로필 사진 업로드에 실패했습니다.", "error");
      setProfileImage(userData?.image || "/image/default.svg");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);

      await uploadImageToServer(file);
    } catch (error) {
      setProfileImage(userData?.image || "/image/default.svg");
      console.error("File change error:", error);
    }
  };

  const convertToWebP = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img: HTMLImageElement = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context not available"));

        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
              type: "image/webp",
            });
            resolve(webpFile);
          } else {
            reject(new Error("Failed to convert image to WebP"));
          }
        }, "image/webp");
      };
      img.onerror = () => reject(new Error("Image loading failed"));
    });
  };

  const handleAddCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isMobile && !isTablet) {
      const imageUrl = URL.createObjectURL(file);
      setModal({
        isOpen: true,
        type: "BACKGROUND",
        data: { imageSrc: imageUrl, file },
      });
      return;
    }

    try {
      const webpFile = await convertToWebP(file);

      const data = await postPresignedUrl({
        type: "background",
        ext: "webp",
      });

      CoverImageMutation.mutate(data.imageName);

      const uploadResponse = await fetch(data.url, {
        method: "PUT",
        body: webpFile,
        headers: {
          "Content-Type": "image/webp",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      showToast("커버 이미지가 변경되었습니다!", "success");
      setCoverImage(data.imageName);
      refetchUserData();
      router.reload();
    } catch (error) {
      console.error("File change error:", error);
      showToast("커버 이미지 업로드에 실패했습니다.", "error");
    }
  };

  const deleteImageMutation = useMutation(deleteMyBackgroundImage, {
    onSuccess: () => {
      showToast("커버 이미지가 삭제되었습니다.", "success");
      router.reload();
    },
    onError: (error: AxiosError) => {
      showToast("커버 이미지 삭제에 실패했습니다.", "error");
      console.error("Image delete error:", error);
    },
  });

  const handleDeleteImage = () => {
    deleteImageMutation.mutate();
  };

  const handleOpenFollowerModal = () => {
    if (isMobile) {
      setModal({
        isOpen: true,
        type: "FOLLOWER",
        data: null,
        isFill: true,
      });
    } else {
      setModal({
        isOpen: true,
        type: "FOLLOWER",
        data: null,
      });
    }
  };

  const handleOpenFollowingModal = () => {
    if (isMobile) {
      setModal({
        isOpen: true,
        type: "FOLLOWING",
        data: null,
        isFill: true,
      });
    } else {
      setModal({
        isOpen: true,
        type: "FOLLOWING",
        data: null,
      });
    }
  };

  const handleDeleteProfileImage = async () => {
    try {
      setProfileImage("/image/default.svg");
      refetchUserData();
      await deleteMyProfileImage();
      showToast("프로필 이미지가 삭제되었습니다.", "success");
    } catch (error) {
      showToast("프로필 이미지 삭제에 실패했습니다.", "error");
      console.error("Image delete error:", error);
      setProfileImage(userData?.image || "/image/default.svg");
    }
  };

  const handleOpenReportModal = () => {
    if (!isLoggedIn) {
      showToast("로그인 후 가능합니다.", "warning");
    } else {
      if (isMobile) {
        setModal({
          isOpen: true,
          type: "REPORT",
          data: { refType: "USER", refId: userData?.id },
          isFill: true,
        });
      } else {
        setModal({
          isOpen: true,
          type: "REPORT",
          data: { refType: "USER", refId: userData?.id },
        });
      }
    }
  };

  const handleWithdrawal = async () => {
    try {
      setModal({
        isOpen: true,
        type: null,
        data: {
          title: "정말 탈퇴하시겠어요?",
          subtitle: "계정 복구는 어려워요.",
          confirmBtn: "탈퇴하기",
          onClick: async () => {
            try {
              await deleteMe();
              setAuth({
                access_token: "",
                isLoggedIn: false,
                user_id: "",
              });
              showToast("회원 탈퇴 되었습니다.", "success");
              router.push("/");
            } catch (err) {
              showToast("탈퇴 중 오류가 발생했습니다.", "error");
            }
          },
        },
        isComfirm: true,
      });
    } catch (error) {
      showToast("탈퇴 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <div className={styles.container}>
      {userData && (
        <>
          {userData.backgroundImage !== "https://image.grimity.com/null" ? (
            <div className={styles.backgroundImage}>
              <img
                src={coverImage}
                width={1400} // 임의 지정
                height={isMobile ? 240 : isTablet ? 300 : 400}
                alt="backgroundImage"
                loading="lazy"
                style={{
                  width: "100vw",
                  height: isMobile ? "240px" : isTablet ? "300px" : "400px",
                  objectFit: "cover",
                }}
              />
              {userData.id === user_id && (
                <div className={styles.coverBtns}>
                  <label htmlFor="edit-cover">
                    {isMobile ? (
                      <div className={styles.coverEditBtn}>
                        <IconComponent name="editCover" size={14} isBtn />
                        수정
                      </div>
                    ) : (
                      <div className={styles.coverEditBtn}>
                        <IconComponent name="editCover" size={20} isBtn />
                        커버 수정
                      </div>
                    )}
                  </label>
                  <input
                    id="edit-cover"
                    type="file"
                    accept="image/*"
                    className={styles.hidden}
                    onChange={handleAddCover}
                  />
                  <div onClick={handleDeleteImage}>
                    {isMobile ? (
                      <div className={styles.coverEditBtn}>
                        <IconComponent name="deleteCover" size={14} isBtn />
                        삭제
                      </div>
                    ) : (
                      <div className={styles.coverEditBtn}>
                        <IconComponent name="deleteCover" size={20} isBtn />
                        커버 삭제
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.backgroundDefaultImageContainer}>
              <div className={styles.background}></div>
              {userData.id === user_id && (
                <>
                  <label htmlFor="upload-cover" className={styles.backgroundAddMessage}>
                    <IconComponent name="addCover" size={20} />
                    커버 추가하기
                  </label>
                  <input
                    id="upload-cover"
                    type="file"
                    accept="image/*"
                    className={styles.hidden}
                    onChange={handleAddCover}
                  />
                </>
              )}
            </div>
          )}
          <section
            className={
              userData.backgroundImage !== "https://image.grimity.com/null"
                ? styles.infoContainer
                : styles.infoContainerDefault
            }
          >
            <div className={styles.imageLeft}>
              {userData.image !== "https://image.grimity.com/null" ? (
                <div className={styles.profileImageContainer}>
                  {profileImage && (
                    <Image
                      src={profileImage}
                      width={isMobile ? 80 : 140}
                      height={isMobile ? 80 : 140}
                      quality={75}
                      alt="프로필 이미지"
                      className={styles.profileImage}
                      unoptimized
                    />
                  )}
                  {userData.id === user_id && (
                    <>
                      <label htmlFor="upload-image" className={styles.addProfileImage}>
                        <IconComponent name="editProfileImage" size={40} isBtn />
                      </label>
                      <input
                        id="upload-image"
                        type="file"
                        accept="image/*"
                        className={styles.hidden}
                        onChange={handleFileChange}
                      />
                      <div className={styles.deleteImageBtn} onClick={handleDeleteProfileImage}>
                        <IconComponent name="deleteProfile" size={40} isBtn />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className={styles.profileImageContainer}>
                  <Image
                    src="/image/default.svg"
                    width={isMobile ? 80 : 140}
                    height={isMobile ? 80 : 140}
                    alt="프로필 이미지"
                    quality={75}
                    className={styles.profileImage}
                    unoptimized
                  />
                  {userData.id === user_id && (
                    <>
                      <label htmlFor="upload-image" className={styles.addProfileImage}>
                        <IconComponent name="addProfileImage" size={40} isBtn />
                      </label>
                      <input
                        id="upload-image"
                        type="file"
                        accept="image/*"
                        className={styles.hidden}
                        onChange={handleFileChange}
                      />
                    </>
                  )}
                </div>
              )}
              <div className={styles.leftContainer}>
                <div className={styles.spaceBetween}>
                  <div>
                    <div className={styles.topContainer}>
                      <h2 className={styles.name}>{userData.name}</h2>
                    </div>
                    {userData.id === user_id ? (
                      <div className={styles.follow}>
                        <div className={styles.myfollower} onClick={handleOpenFollowerModal}>
                          팔로워
                          <p className={styles.followerColor}>
                            {formatCurrency(userData.followerCount)}
                          </p>
                        </div>
                        <div className={styles.myfollower} onClick={handleOpenFollowingModal}>
                          팔로잉
                          <p className={styles.followerColor}>
                            {formatCurrency(userData.followingCount)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.follow}>
                        <div className={styles.follower}>
                          팔로워
                          <p className={styles.followerColor}>
                            {formatCurrency(userData.followerCount)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {isMobile && (
                    <div className={styles.followEdit}>
                      {isLoggedIn ? (
                        isMyProfile ? (
                          <>
                            <div className={styles.editBtn}>
                              <Button
                                size="m"
                                type="outlined-assistive"
                                onClick={handleOpenEditModal}
                              >
                                프로필 편집
                              </Button>
                            </div>
                            <div className={styles.dropdown}>
                              <Dropdown
                                isSide
                                trigger={
                                  <div className={styles.menuBtn}>
                                    <IconComponent name="meatball" size={20} />
                                  </div>
                                }
                                menuItems={[
                                  {
                                    label: "회원 탈퇴",
                                    onClick: handleWithdrawal,
                                    isDelete: true,
                                  },
                                ]}
                              />
                            </div>
                          </>
                        ) : userData.isFollowing ? (
                          <>
                            <div className={styles.followBtn}>
                              <Button
                                size="m"
                                type="outlined-assistive"
                                onClick={handleUnfollowClick}
                              >
                                팔로잉
                              </Button>
                            </div>
                            <div className={styles.dropdown}>
                              <Dropdown
                                isTopItem
                                trigger={
                                  <div className={styles.menuBtn}>
                                    <IconComponent name="meatball" size={20} />
                                  </div>
                                }
                                menuItems={[
                                  {
                                    label: "신고하기",
                                    onClick: handleOpenReportModal,
                                    isDelete: true,
                                  },
                                ]}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={styles.followBtn}>
                              <Button size="m" type="filled-primary" onClick={handleFollowClick}>
                                팔로우
                              </Button>
                            </div>
                            <div className={styles.dropdown}>
                              <Dropdown
                                isTopItem
                                trigger={
                                  <div className={styles.menuBtn}>
                                    <IconComponent name="meatball" size={20} />
                                  </div>
                                }
                                menuItems={[
                                  {
                                    label: "신고하기",
                                    onClick: handleOpenReportModal,
                                    isDelete: true,
                                  },
                                ]}
                              />
                            </div>
                          </>
                        )
                      ) : null}
                    </div>
                  )}
                </div>
                <div
                  className={styles.descriptionContainer}
                  style={{
                    gap: userData.description && userData.links.length > 0 ? "20px" : "0",
                  }}
                >
                  {userData.description !== "" && (
                    <p className={styles.description}>{userData.description}</p>
                  )}
                  <div className={styles.linkContainer}>
                    {userData.links.map(({ linkName, link }, index) => {
                      const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(
                        link,
                      );

                      return (
                        <div key={index} className={styles.linkWrapper}>
                          <IconComponent name="link" size={20} />
                          <a
                            href={isEmail ? `mailto:${link}` : link}
                            className={styles.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {linkName}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {!isMobile && (
              <div className={styles.followEdit}>
                {isMyProfile ? (
                  <>
                    <div className={styles.editBtn}>
                      <Button size="l" type="outlined-assistive" onClick={handleOpenEditModal}>
                        프로필 편집
                      </Button>
                    </div>
                    <div className={styles.dropdown}>
                      <Dropdown
                        isSide
                        trigger={
                          <div className={styles.menuBtn}>
                            <IconComponent name="meatball" size={16} />
                          </div>
                        }
                        menuItems={[
                          {
                            label: "회원 탈퇴",
                            onClick: handleWithdrawal,
                            isDelete: true,
                          },
                        ]}
                      />
                    </div>
                  </>
                ) : userData.isFollowing ? (
                  <>
                    <div className={styles.followBtn}>
                      <Button size="l" type="outlined-assistive" onClick={handleUnfollowClick}>
                        팔로잉
                      </Button>
                    </div>
                    <div className={styles.dropdown}>
                      <Dropdown
                        isSide
                        trigger={
                          <div className={styles.menuBtn}>
                            <IconComponent name="meatball" size={16} />
                          </div>
                        }
                        menuItems={[
                          {
                            label: "신고하기",
                            onClick: handleOpenReportModal,
                            isDelete: true,
                          },
                        ]}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.followBtn}>
                      <Button size="l" type="filled-primary" onClick={handleFollowClick}>
                        팔로우
                      </Button>
                    </div>
                    <div className={styles.dropdown}>
                      <Dropdown
                        trigger={
                          <div className={styles.menuBtn}>
                            <IconComponent name="meatball" size={16} />
                          </div>
                        }
                        menuItems={[
                          {
                            label: "신고하기",
                            onClick: handleOpenReportModal,
                            isDelete: true,
                          },
                        ]}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
