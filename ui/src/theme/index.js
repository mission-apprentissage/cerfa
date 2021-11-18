import { extendTheme } from "@chakra-ui/react";
import { fonts, colors, fontSizes, space, rootFontSizePx, textStyles } from "./theme-beta";
import { components } from "./components/index";

const styles = {
  global: {
    "html, body": {
      fontSize: `${rootFontSizePx}px`,
      fontFamily: "Marianne, Arial",
      background: "white",
      color: "primaryText",
    },
  },
};

const catalogueColors = {
  primaryText: "grey.800",
  primaryBackground: "white",
  secondaryBackground: "#e5edef",
  blue: {
    500: "#007BFF",
  },
};

const overrides = {
  fonts,
  colors: { ...colors, ...catalogueColors },
  styles,
  fontSizes,
  textStyles,
  space,
  components,
};

export default extendTheme(overrides);
