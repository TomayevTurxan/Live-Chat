import { neutral } from "../colors";

const palette = {
  mode: "dark",

  primary: {
    lightest: "rgba(38, 69, 128, 1)",
    light: "rgba(56, 106, 199, 1)",
    main: "rgba(25, 93, 221, 1)",
    dark: "rgba(20, 79, 184, 1)",
    contrastText: "rgba(255, 255, 255, 1)",
  },

  secondary: {
    lightest: "rgba(38, 50, 65, 1)",
    light: "rgba(52, 64, 85, 1)",
    main: "rgba(255, 255, 255, 0.32)",
    dark: "rgba(66, 84, 112, 1)",
    darkest: "rgba(80, 102, 140, 1)",
    contrastText: "rgba(255, 255, 255, 1)",
  },

  success: {
    lightest: "rgba(38, 69, 128, 1)",
    light: "rgba(56, 106, 199, 1)",
    main: "rgba(25, 93, 221, 1)",
    dark: "rgba(20, 79, 184, 1)",
    darkest: "rgba(14, 52, 124, 1)",
    contrastText: "rgba(255, 255, 255, 1)",
  },

  warning: {
    lightest: "rgba(102, 81, 27, 1)",
    light: "rgba(186, 144, 56, 1)",
    main: "rgba(247, 144, 9, 1)",
    dark: "rgba(181, 71, 8, 1)",
    darkest: "rgba(122, 46, 14, 1)",
    contrastText: "rgba(255, 255, 255, 1)",
  },

  error: {
    lightest: "rgba(135, 45, 45, 1)",
    light: "rgba(240, 112, 112, 1)",
    main: "rgba(240, 68, 56, 1)",
    dark: "rgba(185, 28, 28, 1)",
    darkest: "rgba(122, 39, 26, 1)",
    contrastText: "rgba(255, 255, 255, 1)",
  },

  neutral,

  text: {
    primary: "rgba(237, 242, 247, 1)",
    secondary: neutral[400],
    brand: "rgba(25, 93, 221, 1)",
    disabled: "rgba(255, 255, 255, 0.48)",
  },

  divider: "rgba(66, 84, 112, 1)",

  background: {
    default: "rgba(13, 17, 23, 1)",
    partDark: "rgba(26, 32, 44, 1)",
    partLight: "rgba(38, 50, 65, 1)", 
    paper: "rgba(22, 28, 39, 1)",
  },

  action: {
    active: "rgba(108, 122, 157, 1)",
    disabled: "rgba(255, 255, 255, 0.38)",
    disabledBackground: "rgba(255, 255, 255, 0.12)",
    focus: "rgba(25, 93, 221, 0.24)",
    hover: "rgba(25, 93, 221, 0.08)", 
    selected: "rgba(25, 93, 221, 0.16)",
  },
};

export default palette;
