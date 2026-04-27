import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import GroupSettings from "./GroupSettings";

const meta = {
  title: "Common/GroupSettings",
  component: GroupSettings,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: { type: "text" },
    },
    state: {
      control: { type: "radio" },
      options: ["enabled", "pressed", "delete", "editDelete", "disabled"],
    },
  },
} satisfies Meta<typeof GroupSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Title",
    state: "enabled",
  },
};

export const States: Story = {
  args: {
    title: "Title",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <GroupSettings title="Enabled" state="enabled" />
      <GroupSettings title="Pressed" state="pressed" />
      <GroupSettings title="Delete" state="delete" />
      <GroupSettings title="EditDelete" state="editDelete" />
      <GroupSettings title="Disabled" state="disabled" />
    </div>
  ),
};

const initialItems = [
  { id: "item-1", title: "첫 번째 그룹" },
  { id: "item-2", title: "두 번째 그룹" },
  { id: "item-3", title: "세 번째 그룹" },
  { id: "item-4", title: "네 번째 그룹" },
];

function DraggableList() {
  const [items, setItems] = useState(initialItems);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="group-settings">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ display: "flex", flexDirection: "column", gap: 8, width: 320 }}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.draggableProps}>
                    <GroupSettings
                      title={item.title}
                      state="enabled"
                      isDragging={snapshot.isDragging}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export const DraggableStory: Story = {
  args: {
    title: "Title",
  },
  render: () => <DraggableList />,
};
