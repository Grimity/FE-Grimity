import { useEffect, useRef, useState } from "react";
import router from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import clsx from "clsx";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import type { AxiosError } from "axios";

import { useMyData } from "@/api/users/getMe";
import { useMeUpdateProfile } from "@/api/generated/me/me";
import type { UpdateProfileConflictResponse } from "@/api/generated/model";
import type { UserProfileResponse } from "@grimity/dto";

import { useModalStore } from "@/states/modalStore";

import Loader from "@/components/Layout/Loader/Loader";
import Input from "@/components/common/Input/Input/Input";
import TextField from "@/components/common/Input/TextField/TextField";
import Title from "@/components/common/Input/Title/Title";
import Icon from "@/components/common/Icon/Icon";
import GroupSettings from "@/components/common/GroupSettings/GroupSettings";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import Avatar from "@/components/common/Avatar/Avatar";
import Thumbnail from "@/components/common/Thumbnail/Thumbnail";
import BottomSheet from "@/components/common/PopUp/BottomSheet/BottomSheet";
import ListItem from "@/components/common/Cell/ListItem/ListItem";
import { useProfileImages } from "@/components/ProfilePage/Profile/hooks/useProfileImages";

import { useToast } from "@/hooks/useToast";
import { useDeviceStore } from "@/states/deviceStore";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

import { EMAIL_PATTERN } from "@/utils/profileLinkIcon";
import { isValidProfileIdFormat, isForbiddenProfileId } from "@/utils/isValidProfileId";

import PlatformMenu from "./PlatformMenu";
import styles from "./ProfileEdit.module.scss";

interface LinkItem {
  /** 목록 key·드래그 식별용. 순서·삭제가 바뀌어도 입력 state가 엉키지 않게 한다 */
  id: string;
  linkName: string;
  link: string;
  customName?: string;
}

// 플랫폼별 기본 URL(placeholder용)
const PLATFORM_URLS: Record<string, string> = {
  X: "x.com/",
  픽시브: "pixiv.net/users/",
  인스타그램: "instagram.com/",
  유튜브: "youtube.com/",
  이메일: "",
  "직접 입력": "",
};

const PLATFORM_OPTIONS = Object.keys(PLATFORM_URLS);

// 저장 값("이메일")은 유지하고 화면 문구만 Figma에 맞춘다
const PLATFORM_LABELS: Record<string, string> = { 이메일: "Email" };
const getPlatformLabel = (platform: string) => PLATFORM_LABELS[platform] ?? platform;

// 스킴 없이 도메인만 입력해도(placeholder가 암시하는 형태) 허용하고 내부적으로 보완한다.
function normalizeUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// 저장된 값은 스킴+도메인이 포함된 완전한 URL이므로, 입력 시 보여줬던 것과 동일하게
// 편집 필드에서는 플랫폼 도메인을 다시 벗겨내 핸들만 보이도록 한다.
function stripPlatformDomain(linkName: string, link: string) {
  const domain = PLATFORM_URLS[linkName];
  if (!domain) return link;

  const withoutScheme = link.replace(/^https?:\/\//i, "");
  return withoutScheme.toLowerCase().startsWith(domain.toLowerCase())
    ? withoutScheme.slice(domain.length)
    : link;
}

function serializeForm(name: string, description: string, profileId: string, links: LinkItem[]) {
  return JSON.stringify([
    name,
    description,
    profileId,
    links.map(({ linkName, link, customName }) => [linkName, link, customName ?? ""]),
  ]);
}

export default function ProfileEdit() {
  const { data: myData, isLoading, refetch } = useMyData();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [profileId, setProfileId] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  // 저장된 값 기준 스냅샷. 변경 여부(저장 버튼 활성) 판단에 쓴다
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null);
  const [nameError, setNameError] = useState("");
  const [profileIdError, setProfileIdError] = useState("");
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [platformSheetIndex, setPlatformSheetIndex] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const isFormInitializedRef = useRef(false);
  const closeModal = useModalStore((s) => s.closeModal);
  const { restoreScrollPosition } = useScrollRestoration("profileEdit-scroll");
  const { showToast } = useToast();
  const { isMobile } = useDeviceStore();
  // 이미지는 저장과 무관하게 즉시 반영되므로, 뒤의 프로필 페이지 데이터도 함께 갱신한다
  const refetchProfileData = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["userData"] });
  };
  const { profileImage, coverImage, openCoverEditor, openProfileImageEditor, deleteCover } = useProfileImages(
    myData as UserProfileResponse | undefined,
    refetchProfileData,
  );

  useEffect(() => {
    // 이미지 변경으로 myData가 다시 와도 입력 중인 값을 덮어쓰지 않는다
    if (myData && !isFormInitializedRef.current) {
      isFormInitializedRef.current = true;
      setName(myData.name?.trim() || "");
      setDescription(myData.description || "");
      setProfileId(myData.url || "");

      const processed =
        myData.links?.map((link) => {
          const known = Object.keys(PLATFORM_URLS);
          return !known.includes(link.linkName)
            ? { ...link, id: uuidv4(), customName: link.linkName, linkName: "직접 입력" }
            : { ...link, id: uuidv4(), link: stripPlatformDomain(link.linkName, link.link) };
        }) || [];

      setLinks(processed);
      setInitialSnapshot(
        serializeForm(
          myData.name?.trim() || "",
          myData.description || "",
          myData.url || "",
          processed,
        ),
      );
    }

    const scrollPos = sessionStorage.getItem("profileEdit-scroll");
    if (scrollPos !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("profileEdit-scroll");
    }
  }, [myData]);

  const { mutateAsync: updateMyInfo, isPending } = useMeUpdateProfile({
    mutation: {
      onSuccess: () => {
        showToast("프로필 정보가 변경되었습니다!", "success");
        closeModal();
        refetch();
        router.reload();
      },
      onError: (error) => {
        const axiosError = error as unknown as AxiosError<UpdateProfileConflictResponse>;
        if (axiosError.response?.status === 409) {
          const msg = axiosError.response?.data?.message;
          if (msg === "NAME") setNameError("이미 사용 중인 닉네임입니다.");
          else if (msg === "URL") setProfileIdError("이미 사용 중인 프로필 URL입니다.");
          else showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
        } else {
          showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
        }
      },
    },
  });

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedProfileId = profileId.trim();

    if (!trimmedName) return setNameError("닉네임을 입력해주세요.");
    if (trimmedName.length < 2) return showToast("닉네임은 두 글자 이상 입력해야 합니다.", "error");
    if (!trimmedProfileId) return setProfileIdError("프로필 URL을 입력해주세요.");
    if (!isValidProfileIdFormat(trimmedProfileId))
      return setProfileIdError("숫자, 영문(소문자), 언더바(_)만 입력 가능합니다.");
    if (isForbiddenProfileId(trimmedProfileId))
      return setProfileIdError("사용할 수 없는 ID입니다.");

    const hasInvalidLinks = links.some((l) => (l.linkName && !l.link) || (!l.linkName && l.link));
    if (hasInvalidLinks) return showToast("링크 이름과 URL을 모두 입력해주세요.", "error");

    const formattedLinks: { linkName: string; link: string }[] = [];

    for (const l of links) {
      if (!l.linkName || !l.link) continue;

      const linkName = l.linkName === "직접 입력" ? l.customName || "custom" : l.linkName;
      let url = l.link.trim();

      if (l.linkName === "이메일") {
        if (!EMAIL_PATTERN.test(url)) {
          return showToast("올바른 이메일 형식이 아닙니다.", "error");
        }
        formattedLinks.push({ linkName, link: url });
      } else {
        // 플랫폼 도메인이 정해진 경우, 사용자가 핸들만 입력해도(placeholder가 암시하는 형태)
        // 스킴/도메인을 이미 포함하지 않았다면 도메인을 붙여 완전한 URL로 만든다.
        const domain = PLATFORM_URLS[l.linkName];
        if (
          domain &&
          !/^https?:\/\//i.test(url) &&
          !url.toLowerCase().startsWith(domain.toLowerCase())
        ) {
          url = `${domain}${url}`;
        }
        const normalized = normalizeUrl(url);
        try {
          new URL(normalized);
          formattedLinks.push({ linkName, link: normalized });
        } catch {
          return showToast("올바른 URL 형식이 아닙니다.", "error");
        }
      }
    }

    updateMyInfo({
      data: {
        name: trimmedName,
        description,
        url: trimmedProfileId,
        links: formattedLinks,
      },
    });
  };

  const handleLinkDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    setLinks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(source.index, 1);
      next.splice(destination.index, 0, moved);
      return next;
    });
  };

  const updateLink = (index: number, patch: Partial<LinkItem>) => {
    setLinks((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const handlePlatformChange = (index: number, platform: string) => {
    updateLink(index, {
      linkName: platform,
      customName: platform === "직접 입력" ? "" : undefined,
    });
  };

  // 모바일은 전체화면 진입 시 쌓은 history를 되돌려 닫는다(Modal의 닫기 흐름과 동일)
  const handleClose = () => (isMobile ? window.history.back() : closeModal());

  const isDirty = serializeForm(name, description, profileId, links) !== initialSnapshot;
  const isSaveDisabled =
    !isDirty || name.trim().length < 2 || isPending || !!profileIdError || isEditingOrder;

  if (isLoading) return <Loader />;

  const hasCover = Boolean(myData?.backgroundImage);

  return (
    <div className={styles.container}>
      {isMobile ? (
        <div className={styles.mobileHeader}>
          <IconButton
            icon={<Icon name="chevron-left" size={24} />}
            onClick={handleClose}
            aria-label="뒤로가기"
          />
          <h2 className={styles.mobileTitle}>프로필 수정</h2>
          <TextButton variant="primary" size="regular" onClick={handleSave} disabled={isSaveDisabled}>
            저장
          </TextButton>
        </div>
      ) : (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>프로필 수정</h2>
          <IconButton
            icon={<Icon name="x" size={24} />}
            onClick={handleClose}
            aria-label="닫기"
          />
        </div>
      )}
      <div className={styles.scrollArea}>
        <div className={styles.cover}>
          {hasCover ? (
            <Thumbnail src={coverImage} alt="커버 이미지" ratio="4/1" className={styles.coverImage} />
          ) : (
            <div className={styles.coverEmpty} />
          )}
          <div className={styles.coverButtons}>
            <IconButton
              variant="solid"
              icon={<Icon name="camera" size={16} color="white" />}
              onClick={() => openCoverEditor()}
              aria-label="커버 이미지 변경"
              className={styles.overlayBtn}
            />
            <IconButton
              variant="solid"
              icon={<Icon name="x" size={16} color="white" />}
              onClick={deleteCover}
              disabled={!hasCover}
              aria-label="커버 이미지 삭제"
              className={styles.overlayBtn}
            />
          </div>
        </div>
        <div className={styles.textContainer}>
          <div className={styles.profileImage}>
            <Avatar
              src={myData?.image ? profileImage : undefined}
              size={64}
              alt="프로필 이미지"
              className={styles.avatar}
            />
            <IconButton
              variant="solid"
              icon={<Icon name="camera" size={16} color="white" />}
              onClick={() => openProfileImageEditor()}
              aria-label="프로필 이미지 변경"
              className={clsx(styles.overlayBtn, styles.profileCameraBtn)}
            />
          </div>
          <Input
            label="닉네임"
            inputType="textfield"
            helperMessage={nameError}
            helperStatus={nameError ? "error" : "default"}
            textFieldProps={{
              variant: "count",
              maxCount: 12,
              placeholder: "프로필에 노출될 닉네임을 입력해주세요.",
              value: name,
              disabled: isEditingOrder,
              onChange: (e) => {
                setName(e.target.value);
                if (nameError) setNameError("");
              },
            }}
          />
          <Input
            label="자기소개"
            inputType="textarea"
            textAreaProps={{
              placeholder: "자유롭게 소개를 작성해보세요",
              value: description,
              maxCount: 200,
              disabled: isEditingOrder,
              onChange: (e) => setDescription(e.target.value),
            }}
          />
          <Input
            label="그리미티 URL"
            inputType="textfield"
            helperMessage={profileIdError}
            helperStatus={profileIdError ? "error" : "default"}
            textFieldProps={{
              maxLength: 20,
              placeholder: "url을 입력해주세요.",
              value: profileId,
              disabled: isEditingOrder,
              prefix: "www.grimity.com/",
              onChange: (e) => {
                setProfileId(e.target.value.trim());
                if (profileIdError) setProfileIdError("");
              },
            }}
          />
          <div className={styles.linkContainer}>
            <div className={styles.editBar}>
              <Title text="외부 링크" />
              <TextButton
                variant={isEditingOrder ? "primary" : "assistive"}
                size="regular"
                iconRight={isEditingOrder ? undefined : <Icon name="sort-horizontal" size={16} />}
                onClick={() => setIsEditingOrder((prev) => !prev)}
              >
                {isEditingOrder ? "완료" : "순서 편집"}
              </TextButton>
            </div>

            <DragDropContext onDragEnd={handleLinkDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <div
                    className={styles.linkList}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {links.map((link, index) => (
                      <Draggable
                        key={link.id}
                        draggableId={link.id}
                        index={index}
                        isDragDisabled={!isEditingOrder}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={styles.linkRow}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            {link.linkName === "직접 입력" ? (
                              <TextField
                                className={styles.linkNameField}
                                placeholder="직접 입력"
                                aria-label="링크 이름"
                                autoComplete="off"
                                spellCheck={false}
                                value={link.customName || ""}
                                disabled={isEditingOrder}
                                onChange={(e) => updateLink(index, { customName: e.target.value })}
                              />
                            ) : (
                              <div className={styles.platformTrigger}>
                                <PlatformMenu
                                  value={link.linkName}
                                  options={PLATFORM_OPTIONS}
                                  disabled={isEditingOrder}
                                  getLabel={getPlatformLabel}
                                  onSelect={(platform) => handlePlatformChange(index, platform)}
                                  onTriggerClick={
                                    isMobile ? () => setPlatformSheetIndex(index) : undefined
                                  }
                                />
                              </div>
                            )}
                            <GroupSettings
                              className={styles.linkGroupSettings}
                              title={link.link}
                              state={isEditingOrder ? "enabled" : "delete"}
                              isDragging={snapshot.isDragging}
                              dragHandleProps={provided.dragHandleProps}
                              onDelete={() => setLinks((prev) => prev.filter((_, i) => i !== index))}
                            >
                              <input
                                className={styles.linkUrlInput}
                                placeholder={PLATFORM_URLS[link.linkName] || "링크 주소"}
                                aria-label="링크 주소"
                                autoComplete="off"
                                spellCheck={false}
                                inputMode={link.linkName === "이메일" ? "email" : "url"}
                                value={link.link}
                                disabled={isEditingOrder}
                                onChange={(e) => updateLink(index, { link: e.target.value.trim() })}
                              />
                            </GroupSettings>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <OutlinedButton
              size="regular"
              iconLeft={<Icon name="plus" size={20} />}
              className={styles.addLinkButton}
              disabled={isEditingOrder}
              onClick={() => setLinks((prev) => [...prev, { id: uuidv4(), linkName: "", link: "" }])}
            >
              링크 추가
            </OutlinedButton>
          </div>
        </div>
      </div>
      {!isMobile && (
        <div className={styles.footer}>
          <SolidButton size="large" className={styles.saveButton} onClick={handleSave} disabled={isSaveDisabled}>
            저장
          </SolidButton>
        </div>
      )}
      <BottomSheet
        isOpen={platformSheetIndex !== null}
        onClose={() => setPlatformSheetIndex(null)}
        title="외부 링크 선택"
        showCloseIcon
      >
        <div className={styles.platformSheetList}>
          {PLATFORM_OPTIONS.map((platform) => (
            <ListItem
              key={platform}
              type="optionCard"
              text={getPlatformLabel(platform)}
              active={platformSheetIndex !== null && links[platformSheetIndex]?.linkName === platform}
              onClick={() => {
                if (platformSheetIndex !== null) handlePlatformChange(platformSheetIndex, platform);
                setPlatformSheetIndex(null);
              }}
            />
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
