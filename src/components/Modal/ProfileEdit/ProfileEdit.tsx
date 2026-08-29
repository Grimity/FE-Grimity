import { useEffect, useState } from "react";
import router from "next/router";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import type { AxiosError } from "axios";

import { useMyData } from "@/api/users/getMe";
import { useMeUpdateProfile } from "@/api/generated/me/me";
import type { UpdateProfileConflictResponse } from "@/api/generated/model";

import { useModalStore } from "@/states/modalStore";

import Loader from "@/components/Layout/Loader/Loader";
import Input from "@/components/common/Input/Input/Input";
import TextField from "@/components/common/Input/TextField/TextField";
import Title from "@/components/common/Input/Title/Title";
import Icon from "@/components/common/Icon/Icon";
import Menu from "@/components/common/Navigation/Menu/Menu";
import GroupSettings from "@/components/common/GroupSettings/GroupSettings";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import TextButton from "@/components/common/Button/TextButton/TextButton";

import { useToast } from "@/hooks/useToast";
import { useDeviceStore } from "@/states/deviceStore";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

import { isValidProfileIdFormat, isForbiddenProfileId } from "@/utils/isValidProfileId";

import styles from "./ProfileEdit.module.scss";

interface LinkItem {
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

export default function ProfileEdit() {
  const { data: myData, isLoading, refetch } = useMyData();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [profileId, setProfileId] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [nameError, setNameError] = useState("");
  const [profileIdError, setProfileIdError] = useState("");
  const [isEditingOrder, setIsEditingOrder] = useState(false);

  const closeModal = useModalStore((s) => s.closeModal);
  const { restoreScrollPosition } = useScrollRestoration("profileEdit-scroll");
  const { showToast } = useToast();
  const { isMobile } = useDeviceStore();

  useEffect(() => {
    if (myData) {
      setName(myData.name?.trim() || "");
      setDescription(myData.description || "");
      setProfileId(myData.url || "");

      const processed =
        myData.links?.map((link) => {
          const known = Object.keys(PLATFORM_URLS);
          return !known.includes(link.linkName)
            ? { ...link, customName: link.linkName, linkName: "직접 입력" }
            : { ...link, link: stripPlatformDomain(link.linkName, link.link) };
        }) || [];

      setLinks(processed);
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(url)) {
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
    const newLinks = [...links];
    const [moved] = newLinks.splice(result.source.index, 1);
    newLinks.splice(result.destination.index, 0, moved);
    setLinks(newLinks);
  };

  const handlePlatformChange = (index: number, platform: string) => {
    const newLinks = [...links];
    newLinks[index] = {
      ...newLinks[index],
      linkName: platform,
      customName: platform === "직접 입력" ? "" : undefined,
    };
    setLinks(newLinks);
  };

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      {!isMobile && (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>프로필 편집</h2>
        </div>
      )}
      <div className={styles.textBtnContainer}>
        <div className={styles.textContainer}>
          <Input
            label="닉네임"
            inputType="textfield"
            maxCount={12}
            helperMessage={nameError}
            helperStatus={nameError ? "error" : "default"}
            textFieldProps={{
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
            maxCount={20}
            helperMessage={profileIdError}
            helperStatus={profileIdError ? "error" : "default"}
            textFieldProps={{
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
                        key={index}
                        draggableId={`link-${index}`}
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
                                placeholder="링크 이름"
                                value={link.customName || ""}
                                disabled={isEditingOrder}
                                onChange={(e) => {
                                  const newLinks = [...links];
                                  newLinks[index].customName = e.target.value;
                                  setLinks(newLinks);
                                }}
                              />
                            ) : (
                              <Menu
                                wrapperClassName={styles.platformTrigger}
                                align="left"
                                disabled={isEditingOrder}
                                trigger={
                                  <button
                                    type="button"
                                    className={styles.platformSelect}
                                    disabled={isEditingOrder}
                                    aria-label="플랫폼 선택"
                                  >
                                    <span className={styles.platformSelectLabel}>
                                      {link.linkName || "선택"}
                                    </span>
                                    <Icon
                                      name="chevron-down"
                                      size={16}
                                      className={styles.platformSelectIcon}
                                    />
                                  </button>
                                }
                                items={PLATFORM_OPTIONS.map((platform) => ({
                                  label: platform,
                                  selected: link.linkName === platform,
                                  onClick: () => handlePlatformChange(index, platform),
                                }))}
                              />
                            )}
                            <GroupSettings
                              className={styles.linkGroupSettings}
                              title={link.link}
                              state={isEditingOrder ? "enabled" : "delete"}
                              isDragging={snapshot.isDragging}
                              dragHandleProps={provided.dragHandleProps}
                              onDelete={() => setLinks(links.filter((_, i) => i !== index))}
                            >
                              <input
                                className={styles.linkUrlInput}
                                placeholder={
                                  link.linkName === "직접 입력"
                                    ? "전체 URL을 입력해주세요."
                                    : PLATFORM_URLS[link.linkName] || "링크를 입력해주세요."
                                }
                                value={link.link}
                                disabled={isEditingOrder}
                                onChange={(e) => {
                                  const value = e.target.value.trim();
                                  const newLinks = [...links];
                                  newLinks[index].link = value;
                                  setLinks(newLinks);
                                }}
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
              iconLeft={<Icon name="plus" size={16} />}
              disabled={isEditingOrder}
              onClick={() => setLinks([...links, { linkName: "", link: "" }])}
            >
              링크 추가
            </OutlinedButton>
          </div>
        </div>
        <SolidButton
          size="large"
          onClick={handleSave}
          disabled={name.trim().length < 2 || isPending || !!profileIdError || isEditingOrder}
        >
          저장
        </SolidButton>
      </div>
    </div>
  );
}
