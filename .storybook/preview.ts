import type { Preview } from "@storybook/react";

import "@/styles/tokens/typography/fonts.scss";
import "@/styles/tokens/colors/_semantic.scss";

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#383838" },
      ],
      default: "light",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
