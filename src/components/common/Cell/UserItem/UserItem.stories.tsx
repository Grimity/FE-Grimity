import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import Icon from "@/components/common/Icon/Icon";
import UserItem from "./UserItem";

const meta = {
  title: "Common/Cell/UserItem",
  component: UserItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      options: [
        "default",
        "id",
        "iconId",
        "radio",
        "follow",
        "notification",
        "link",
        "linkMain",
        "bookMark",
        "communityTitle",
        "title",
        "image",
        "comment",
        "commentxs",
        "commentPlus",
        "commentPlusxs",
        "commentDeleted",
      ],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof UserItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const WRAPPER_STYLE = { width: 480 };

export const Default: Story = {
  args: {
    type: "default",
    nickname: "닉네임",
  },
  render: (args) => (
    <div style={WRAPPER_STYLE}>
      <UserItem {...args}>
        <OutlinedButton size="small">팔로우</OutlinedButton>
      </UserItem>
    </div>
  ),
};

export const Id: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem type="id" nickname="닉네임" userId="user_id">
        <OutlinedButton size="small">팔로우</OutlinedButton>
      </UserItem>
    </div>
  ),
};

export const IconId: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem type="iconId" nickname="닉네임" userId="user_id">
        <IconButton
          variant="sm"
          icon={<Icon name="chat-round" size={16} />}
        />
        <IconButton
          variant="sm"
          icon={<Icon name="dotmenu" size={16} />}
        />
      </UserItem>
    </div>
  ),
};

export const Radio: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem
        type="radio"
        nickname="닉네임"
        userId="user_id"
        selected={false}
      />
      <UserItem
        type="radio"
        nickname="선택된 유저"
        userId="selected_user"
        selected
      />
    </div>
  ),
};

export const Notification: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem
        type="notification"
        category="좋아요"
        message="닉네임님이 회원님의 게시글을 좋아합니다."
        time="1시간 전"
        onClose={() => {}}
      />
      <UserItem
        type="notification"
        category="댓글"
        message="닉네임님이 회원님의 게시글에 댓글을 남겼습니다."
        time="3시간 전"
        onClose={() => {}}
      />
    </div>
  ),
};

export const Link: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem
        type="link"
        brandIcon={
          <div
            style={{
              width: 32,
              height: 32,
              backgroundColor: "#FF0000",
              borderRadius: 4,
            }}
          />
        }
        siteName="YouTube"
        url="https://youtube.com/@user"
      />
    </div>
  ),
};

export const LinkMain: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem
        type="linkMain"
        brandIcon={
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#1DA1F2",
              borderRadius: 4,
            }}
          />
        }
        siteName="Twitter"
      />
    </div>
  ),
};

export const BookMark: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem
        type="bookMark"
        showTag
        tag="자유"
        postTitle="게시글 제목이 여기에 표시됩니다"
        body="게시글 본문 내용이 여기에 표시됩니다. 최대 2줄까지 표시되며 그 이후에는 말줄임 처리됩니다."
        commentCount={5}
        nickname="닉네임"
        heartCount="12"
        viewCount="345"
        timeCount="1시간 전"
        bookmarkActive
        onBookmarkClick={() => {}}
      />
      <UserItem
        type="bookMark"
        postTitle="태그 없는 게시글"
        body="본문 텍스트 예시입니다."
        commentCount={0}
        nickname="작성자"
        heartCount="3"
        viewCount="50"
        timeCount="2시간 전"
        bookmarkActive={false}
        onBookmarkClick={() => {}}
      />
    </div>
  ),
};

export const CommunityTitle: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem
        type="communityTitle"
        showTag
        tag="질문"
        postTitle="커뮤니티 게시글 제목입니다"
        body="본문 내용이 한 줄로 표시됩니다. 넘치면 말줄임 처리됩니다."
        commentCount={8}
        nickname="닉네임"
        heartCount="24"
        viewCount="1.2K"
        timeCount="30분 전"
      />
    </div>
  ),
};

export const Title: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem
        type="title"
        showTag
        tag="공지"
        postTitle="게시글 제목이 여기에 표시됩니다"
        nickname="닉네임"
        heartCount="15"
        viewCount="200"
        timeCount="1시간 전"
        chattingCount="3"
      />
      <UserItem
        type="title"
        postTitle="태그 없는 게시글 제목"
        nickname="다른 사용자"
        heartCount="5"
        viewCount="80"
        timeCount="3시간 전"
      />
    </div>
  ),
};

export const Image: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem
        type="image"
        thumbnailUrl="https://placehold.co/48x48"
        postTitle="썸네일이 있는 게시글 제목"
        nickname="닉네임"
        heartCount="7"
        viewCount="120"
        timeCount="2시간 전"
        chattingCount="1"
      />
    </div>
  ),
};

export const Comment: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem
        type="comment"
        nickname="닉네임"
        timeCount="1시간 전"
        commentText="댓글 내용이 여기에 표시됩니다. 여러 줄의 텍스트도 지원합니다."
        likeCount="5"
        isAuthor
        onLikeClick={() => {}}
        onReplyClick={() => {}}
        onMenuClick={() => {}}
      />
    </div>
  ),
};

export const CommentXs: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem
        type="commentxs"
        nickname="닉네임"
        timeCount="30분 전"
        commentText="작은 아바타 사이즈의 댓글입니다."
        likeCount="2"
        onLikeClick={() => {}}
        onReplyClick={() => {}}
        onMenuClick={() => {}}
      />
    </div>
  ),
};

export const CommentPlus: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem
        type="commentPlus"
        nickname="답글작성자"
        timeCount="10분 전"
        mentionName="원댓글작성자"
        commentText="답글 내용이 여기에 표시됩니다."
        likeCount="1"
        onLikeClick={() => {}}
        onReplyClick={() => {}}
        onMenuClick={() => {}}
      />
    </div>
  ),
};

export const CommentPlusXs: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem
        type="commentPlusxs"
        nickname="답글작성자"
        timeCount="5분 전"
        mentionName="원댓글작성자"
        commentText="컴팩트한 답글입니다."
        likeCount="0"
        onLikeClick={() => {}}
        onReplyClick={() => {}}
        onMenuClick={() => {}}
      />
    </div>
  ),
};

export const CommentDeleted: Story = {
  render: () => (
    <div style={WRAPPER_STYLE}>
      <UserItem type="commentDeleted" />
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ ...WRAPPER_STYLE, display: "flex", flexDirection: "column", gap: 16 }}>
      <UserItem type="default" nickname="기본 유저">
        <OutlinedButton size="small">팔로우</OutlinedButton>
      </UserItem>

      <UserItem type="id" nickname="아이디 유저" userId="user_id">
        <OutlinedButton size="small">팔로우</OutlinedButton>
      </UserItem>

      <UserItem type="radio" nickname="라디오 유저" userId="radio_user" selected />

      <UserItem
        type="notification"
        category="좋아요"
        message="닉네임님이 게시글을 좋아합니다."
        time="1시간 전"
        onClose={() => {}}
      />

      <UserItem
        type="link"
        brandIcon={
          <div style={{ width: 32, height: 32, backgroundColor: "#FF0000", borderRadius: 4 }} />
        }
        siteName="YouTube"
        url="https://youtube.com/@user"
      />

      <UserItem
        type="bookMark"
        showTag
        tag="자유"
        postTitle="북마크된 게시글"
        body="본문 내용 미리보기"
        commentCount={3}
        nickname="작성자"
        heartCount="10"
        viewCount="200"
        timeCount="1시간 전"
        bookmarkActive
        onBookmarkClick={() => {}}
      />

      <UserItem
        type="title"
        showTag
        tag="공지"
        postTitle="게시글 제목"
        nickname="관리자"
        heartCount="50"
        viewCount="1K"
        timeCount="2시간 전"
      />

      <UserItem
        type="comment"
        nickname="댓글 작성자"
        timeCount="30분 전"
        commentText="댓글 내용입니다."
        likeCount="3"
        onLikeClick={() => {}}
        onReplyClick={() => {}}
        onMenuClick={() => {}}
      />

      <UserItem
        type="commentPlus"
        nickname="답글 작성자"
        timeCount="10분 전"
        mentionName="댓글 작성자"
        commentText="답글 내용입니다."
        likeCount="0"
        onLikeClick={() => {}}
        onReplyClick={() => {}}
        onMenuClick={() => {}}
      />

      <UserItem type="commentDeleted" />
    </div>
  ),
};

// ============================================
// Playground (Interactive)
// ============================================

function RadioSelectPlayground() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const users = [
    { nickname: "아티스트1", userId: "artist_1" },
    { nickname: "아티스트2", userId: "artist_2" },
    { nickname: "아티스트3", userId: "artist_3" },
  ];

  return (
    <div>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#888" }}>
        Radio — 유저 선택
      </p>
      {users.map((user, i) => (
        <UserItem
          key={user.userId}
          type="radio"
          nickname={user.nickname}
          userId={user.userId}
          selected={selectedIdx === i}
          onClick={() => setSelectedIdx(i)}
        />
      ))}
    </div>
  );
}

function NotificationPlayground() {
  const [notifications, setNotifications] = useState([
    { id: 1, category: "좋아요", message: "아티스트님이 게시글을 좋아합니다.", time: "1시간 전" },
    { id: 2, category: "댓글", message: "유저님이 댓글을 남겼습니다.", time: "2시간 전" },
    { id: 3, category: "팔로우", message: "새로운 팔로워가 생겼습니다.", time: "3시간 전" },
  ]);

  const dismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#888" }}>
        Notification — X 버튼으로 삭제
      </p>
      {notifications.length === 0 ? (
        <p style={{ fontSize: 13, color: "#aaa" }}>알림이 없습니다.</p>
      ) : (
        notifications.map((n) => (
          <UserItem
            key={n.id}
            type="notification"
            category={n.category}
            message={n.message}
            time={n.time}
            onClose={() => dismiss(n.id)}
          />
        ))
      )}
    </div>
  );
}

function BookmarkPlayground() {
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set([0]));

  const posts = [
    { tag: "자유", title: "첫 번째 게시글 제목", body: "본문 내용 미리보기입니다.", comments: 5, heart: "12", view: "345", time: "1시간 전" },
    { tag: "질문", title: "두 번째 게시글 제목", body: "이것은 질문 게시글의 본문입니다.", comments: 2, heart: "3", view: "80", time: "2시간 전" },
    { tag: "공지", title: "세 번째 게시글 제목", body: "공지사항 본문 내용.", comments: 0, heart: "50", view: "1.2K", time: "3시간 전" },
  ];

  const toggleBookmark = (i: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#888" }}>
        BookMark — 북마크 토글
      </p>
      {posts.map((post, i) => (
        <UserItem
          key={i}
          type="bookMark"
          showTag
          tag={post.tag}
          postTitle={post.title}
          body={post.body}
          commentCount={post.comments}
          nickname="작성자"
          heartCount={post.heart}
          viewCount={post.view}
          timeCount={post.time}
          bookmarkActive={bookmarks.has(i)}
          onBookmarkClick={() => toggleBookmark(i)}
        />
      ))}
    </div>
  );
}

function CommentPlayground() {
  const [likes, setLikes] = useState<Record<string, number>>({
    c1: 3,
    c2: 0,
    r1: 1,
  });
  const [replyTarget, setReplyTarget] = useState<string | null>(null);

  const handleLike = (id: string) => {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  return (
    <div>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#888" }}>
        Comment — 좋아요 / 답글달기
      </p>
      {replyTarget && (
        <div
          style={{
            padding: "8px 12px",
            marginBottom: 8,
            background: "#f5f5f5",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          &quot;{replyTarget}&quot;에게 답글 작성 중...
          <button
            type="button"
            onClick={() => setReplyTarget(null)}
            style={{ marginLeft: 8, cursor: "pointer", border: "none", background: "none", color: "#888" }}
          >
            취소
          </button>
        </div>
      )}
      <UserItem
        type="comment"
        nickname="댓글 작성자"
        profileImage=""
        timeCount="30분 전"
        commentText="이 작품 정말 멋지네요! 색감이 특히 좋아요."
        likeCount={String(likes.c1)}
        isAuthor
        onLikeClick={() => handleLike("c1")}
        onReplyClick={() => setReplyTarget("댓글 작성자")}
        onMenuClick={() => alert("메뉴 열기")}
      />
      <UserItem
        type="commentPlus"
        nickname="답글 작성자"
        profileImage=""
        timeCount="10분 전"
        mentionName="댓글 작성자"
        commentText="저도 동감입니다!"
        likeCount={String(likes.r1)}
        onLikeClick={() => handleLike("r1")}
        onReplyClick={() => setReplyTarget("답글 작성자")}
        onMenuClick={() => alert("메뉴 열기")}
      />
      <UserItem
        type="commentxs"
        nickname="다른 유저"
        profileImage=""
        timeCount="5분 전"
        commentText="좋은 글이네요."
        likeCount={String(likes.c2)}
        onLikeClick={() => handleLike("c2")}
        onReplyClick={() => setReplyTarget("다른 유저")}
        onMenuClick={() => alert("메뉴 열기")}
      />
      <UserItem type="commentDeleted" />
    </div>
  );
}

export const Playground: Story = {
  render: () => (
    <div style={{ ...WRAPPER_STYLE, display: "flex", flexDirection: "column", gap: 40 }}>
      <RadioSelectPlayground />
      <NotificationPlayground />
      <BookmarkPlayground />
      <CommentPlayground />
    </div>
  ),
};
