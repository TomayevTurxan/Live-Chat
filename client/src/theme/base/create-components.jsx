import { alpha, createTheme } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { brand } from "../colors";

// Used only to create transitions
const muiTheme = createTheme();

export const createComponents = () => {
  return {
    MuiDateField: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
        },
        sizeMedium: {
          padding: "12px 16px",
        },
      },
      defaultProps: {
        size: "small",
        format: "DD.MM.YYYY",
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0,
        },
      },
    },
    MuiBreadcrumbs: {
      defaultProps: {
        separator: (
          <FiberManualRecordIcon
            sx={{
              fontSize: 6,
              color: "neutral.500",
            }}
          />
        ),
      },
    },
    MuiSvgIcon: {
      defaultProps: {
        fontSize: "small",
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          minWidth: 250,
        },
      },
      defaultProps: {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        // root: {
        // borderRadius: "8px",
        // textTransform: "none",
        // },
        root: ({ theme }) => ({
          borderRadius: "8px",
          textTransform: "none",
          // backgroundColor: theme.palette.primary.main,
          // "&:hover": {
          //   backgroundColor: theme.palette.primary.light,
          //   color: theme.palette.primary.main,
          // },
        }),
        sizeSmall: {
          padding: "6px 16px",
        },
        sizeMedium: {
          padding: "8px 20px",
        },
        sizeLarge: {
          padding: "11px 24px",
        },
        textSizeSmall: {
          padding: "7px 12px",
        },
        textSizeMedium: {
          padding: "9px 16px",
        },
        textSizeLarge: {
          padding: "12px 16px",
        },
      },
      defaultProps: {
        size: "small",
      },
    },
    MuiInputLabel: {
      color: "primary",
    },
    MuiCard: {
      styleOverrides: {
        root: () => ({
          borderRadius: 14,
        }),
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "16px",
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: "h6",
        },
        subheaderTypographyProps: {
          variant: "body2",
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        color: "primary",
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          MozOsxFontSmoothing: "grayscale",
          WebkitFontSmoothing: "antialiased",
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          width: "100%",
        },
        body: {
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          minHeight: "100%",
          width: "100%",
        },
        "#__next": {
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        sizeSmall: {
          padding: 4,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            opacity: 1,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: "24px",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          "&.MuiInputBase-inputSizeSmall": {
            height: "1.4375em",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          "&.Mui-selected": {
            backgroundColor: theme.palette.primary.dark,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        }),
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            backgroundColor: "transparent",
            borderRadius: 8,
            borderStyle: "solid",
            borderColor: theme.palette.divider,
            borderWidth: 1,
            overflow: "hidden",
            transition: muiTheme.transitions.create([
              "border-color",
              "box-shadow",
            ]),
            "&:before": {
              display: "none",
            },
            "&:after": {
              display: "none",
            },
          };
        },
        input: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: "24px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            boxShadow: "none !important",
          },
        },
        input: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: "24px",
        },
        notchedOutline: {
          error: {
            boxShadow: "none",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          overflow: "hidden",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          margin: "10px 0px",
        },
      },
      defaultProps: {
        underline: "hover",
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          marginRight: "16px",
          minWidth: "unset",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: (...args) => {
          console.log(args[0].theme.palette.mode);
          const theme = args[0].theme;

          return {
            backgroundImage: "none",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor:
              theme.palette.mode === "dark"
                ? theme.palette.neutral[800]
                : theme.palette.neutral[200],
          };
        },
      },
    },
    MuiDatePicker: {
      defaultProps: {
        size: "small",
        format: "DD.MM.YYYY",
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            backgroundColor: theme.palette.neutral[100],
            ...theme.applyStyles("dark", {
              backgroundColor: theme.palette.neutral[800],
            }),
          };
        },
      },
    },
    MuiPopover: {
      defaultProps: {
        elevation: 16,
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => {
          const palette = theme.palette;

          return {
            backdropFilter: "blur(6px)",
            background: alpha(palette.neutral[800], 0.8),
          };
        },
        arrow: ({ theme }) => {
          const palette = theme.palette;

          return {
            color: alpha(palette.neutral[800], 0.8),
          };
        },
      },
    },
    MuiRadio: {
      defaultProps: {
        color: "primary",
      },
    },
    MuiSwitch: {
      defaultProps: {
        color: "primary",
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.71,
          minWidth: "auto",
          paddingLeft: 0,
          paddingRight: 0,
          textTransform: "none",
          "& + &": {
            marginLeft: 24,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            borderBottomColor: theme.palette.divider,
          };
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "medium",
        slotProps: {
          formHelperText: {
            role: "alert",
          },
        },
      },
      styleOverrides: {
        root: {
          margin: "5px 0px",
        },
      },
    },
  };
};
