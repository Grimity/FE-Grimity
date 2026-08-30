import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ActionMenu from "./ActionMenu";
import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";

const meta = {
  title: "Common/Navigation/ActionMenu",
  component: ActionMenu,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ActionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  { label: "공유하기", onClick: () => {} },
  { label: "수정하기", onClick: () => {} },
  { label: "삭제하기", onClick: () => {} },
];

function Demo({ displayMode }: { displayMode: "menu" | "bottomSheet" }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: 24, height: 400 }}>
      <ActionMenu items={ITEMS} open={open} onOpenChange={setOpen} displayMode={displayMode}>
        <IconButton
          variant="sm"
          icon={<Icon name="dotmenu" size={20} />}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="더보기"
        />
      </ActionMenu>
    </div>
  );
}

export const Dropdown: Story = {
  args: { items: ITEMS, open: true, onOpenChange: () => {}, children: null },
  render: () => <Demo displayMode="menu" />,
};

export const BottomSheet: Story = {
  args: { items: ITEMS, open: true, onOpenChange: () => {}, children: null },
  render: () => <Demo displayMode="bottomSheet" />,
};
