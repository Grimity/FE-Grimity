import type { Preview } from "@storybook/react";

import "@/styles/tokens/typography/fonts.scss";
import "@/styles/tokens/colors/_semantic.scss";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
