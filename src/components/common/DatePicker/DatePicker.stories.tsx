import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import DatePicker from "@/components/common/DatePicker";
import { DatePickerMode } from "@/components/common/DatePicker/DatePicker.types";

const meta = {
  title: "Common/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onDateChange: fn(),
  },
  argTypes: {
    mode: {
      options: [DatePickerMode.WEEK, DatePickerMode.MONTH],
      control: { type: "radio" },
      description: "DatePicker 모드 (주간/월간)",
    },
    selectedDate: {
      control: { type: "date" },
      description: "선택된 날짜",
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Week: Story = {
  args: {
    mode: DatePickerMode.WEEK,
    selectedDate: new Date(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date>(args.selectedDate ?? new Date());
    return (
      <div style={{ width: 400 }}>
        <DatePicker
          {...args}
          selectedDate={date}
          onDateChange={(next) => {
            setDate(next);
            args.onDateChange(next);
          }}
        />
      </div>
    );
  },
};

export const Month: Story = {
  args: {
    mode: DatePickerMode.MONTH,
    selectedDate: new Date(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date>(args.selectedDate ?? new Date());
    return (
      <div style={{ width: 400 }}>
        <DatePicker
          {...args}
          selectedDate={date}
          onDateChange={(next) => {
            setDate(next);
            args.onDateChange(next);
          }}
        />
      </div>
    );
  },
};
