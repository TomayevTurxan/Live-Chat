import {
  createTheme as createMuiTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import darkScheme from "./color-schemes/dark";
import lightScheme from "./color-schemes/light";
import { createComponents } from "./base/create-components";
import { createTypography } from "./base/create-typography";
import { createShadows } from "./base/create-shadows";

const createTheme = (mode) => {
  let theme = createMuiTheme({
    palette: {
      mode: mode, 
      ...(mode === "dark" ? darkScheme : lightScheme), 
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: createComponents(),
    typography: createTypography(),
    shadows: createShadows(),
    colorSchemes: {
      dark: {
        palette: darkScheme,
      },
      light: {
        palette: lightScheme,
      },
    },
  });

  theme = responsiveFontSizes(theme);

  return theme;
};

const theme = createTheme();

export default theme;
