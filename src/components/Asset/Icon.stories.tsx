import type { Meta, StoryObj } from "@storybook/react";

import Icon, { IconList } from "@/components/Asset/IconTemp";

import ICONS_TEMP from "@/constants/asset";

import styles from "@/components/Asset/Icon.stories.module.scss";

const meta = {
  title: "Asset/Icon (Legacy)",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
      control: {
        type: "radio",
      },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: "home",
  },
};

export const Icons: Story = {
  tags: ["autodocs"],
  args: {
    icon: "home",
  },
  argTypes: {
    icon: {
      table: {
        disable: true,
      },
    },
  },
  render: (props) => {
    return (
      <div className={styles.container}>
        <div className={styles.iconList}>
          {Object.keys(ICONS_TEMP)
            .sort()
            .map((icon) => (
              <div className={styles.iconItem} key={icon}>
                <Icon {...props} icon={icon as IconList} />
                <Icon
                  {...props}
                  className={`${props.className} ${styles.green}`}
                  icon={icon as IconList}
                />
                <span className={styles.iconName}>{icon}</span>
              </div>
            ))}
        </div>
      </div>
    );
  },
};
