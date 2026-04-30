import type { Meta, StoryObj } from "@storybook/react";
import Menu from "./Menu";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";

const meta = {
  title: "Common/Navigation/Menu",
  component: Menu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithBorderBottom: Story = {
  args: {
    items: [
      { label: "내 프로필", onClick: () => {} , borderBottom: true },
      { label: "좋아요한 그림", onClick: () => {} },
      { label: "저장한 그림", onClick: () => {} },
      { label: "저장한 글", onClick: () => {}, borderBottom: true },
      { label: "설정", onClick: () => {} },
      { label: "로그아웃", onClick: () => {} },
    ],
  },
};

export const WithoutBorderBottom: Story = {
  args: {
    items: [
      { label: "최신순", onClick: () => {} },
      { label: "좋아요순", onClick: () => {} },
    ],
  },
};

export const WithToggle: Story = {
  args: { items: [] },
  render: () => (
    <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
      <Menu
        trigger={<SolidButton size="small">메뉴 열기</SolidButton>}
        items={[
          { label: "내 프로필" },
          { label: "좋아요한 그림" },
          { label: "저장한 그림" },
          { label: "저장한 글", borderBottom: true },
          { label: "설정", borderBottom: true },
          { label: "로그아웃" },
        ]}
        align="right"
      />
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};
