import { neutral } from "../colors";
const palette = {
  mode: "light",

  primary: {
    lightest: "rgba(230, 239, 255, 1)",
    light: "rgba(180, 210, 255, 1)",
    main: "rgba(25, 93, 221, 1)",
    dark: "rgba(18, 69, 164, 1)",
    darkest: "rgba(14, 52, 124, 1)",
    contrastText: "rgba(255, 255, 255, 1)",
  },
  warning: {
    lightest: "rgba(255, 250, 235, 1)",
    light: "rgba(254, 240, 199, 1)",
    main: "rgba(247, 144, 9, 1)",
    dark: "rgba(181, 71, 8, 1)",
    darkest: "rgba(122, 46, 14, 1)",
    contrastText: "rgba(255, 255, 255, 1)",
  },
  error: {
    lightest: "rgba(254, 243, 242, 1)",
    light: "rgba(252, 165, 165, 1)",
    main: "rgba(240, 68, 56, 1)",
    dark: "rgba(185, 28, 28, 1)",
    darkest: "rgba(122, 39, 26, 1)",
    contrastText: "rgba(255, 255, 255, 1)",
  },
  success: {
    lightest: "rgba(230, 239, 255, 1)",
    light: "rgba(180, 210, 255, 1)",
    main: "rgba(25, 93, 221, 1)",
    dark: "rgba(18, 69, 164, 1)",
    darkest: "rgba(14, 52, 124, 1)",
    contrastText: "rgba(255, 255, 255, 1)",
  },
  secondary: {
    lightest: "rgba(230, 239, 255, 1)",
    light: "rgba(207, 229, 255, 1)",
    main: "rgba(255, 255, 255, 0.48)",
    dark: "rgba(18, 69, 164, 1)",
    darkest: "rgba(14, 52, 124, 1)",
    contrastText: "rgba(255, 255, 255, 1)",
  },
  neutral,
  divider: "rgba(210, 210, 210, 0.4)",
  background: {
    default: "rgba(255, 255, 255, 1)",
    paper: "rgba(255, 255, 255, 1)",
    partDark: "rgba(34, 39, 45, 1)",
    partLight: "rgb(238, 238, 235)",
  },
  text: {
    primary: "rgba(17, 24, 39, 1)",
    secondary: neutral[400],
    brand: "rgba(25, 93, 221, 1)",
    disabled: "rgba(17, 24, 39, 0.38)",
  },
  action: {
    active: "rgba(25, 93, 221, 1)",
    disabled: "rgba(17, 24, 39, 0.38)",
    disabledBackground: "rgba(17, 24, 39, 0.12)",
    focus: "rgba(25, 93, 221, 0.16)",
    hover: "rgba(25, 93, 221, 0.08)",
    selected: "rgba(25, 93, 221, 0.12)",
  },
  baseShadow:
    "rgba(25, 93, 221, 0.07) 0px 4px 16px 0px, rgba(25, 93, 221, 0.07) 0px 8px 16px -5px",
};

export default palette;
