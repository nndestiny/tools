import { createTheme, PaletteMode } from "@mui/material";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";

export default function themeRegister(mode: PaletteMode) {
  return createTheme({
    typography: {
      fontFamily:
        "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
    },
    palette: {
      mode,
      primary: {
        light: "#82b140",
        main: "#BBFE5C",
        dark: "#c8fe7c",
        contrastText: "#fff",
      },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "rgba(121, 133, 151, .5)",
            "--TextField-brandBorderHoverColor": "#82b140",
            "--TextField-brandBorderFocusedColor": "#BBFE5C",
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          input: {
            "&::placeholder": {
              color: "#55606F", // 在这里指定 placeholder 的颜色
              opacity: 1,
            },
          },
          notchedOutline: {
            borderColor: "var(--TextField-brandBorderColor)",
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderHoverColor)",
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderFocusedColor)",
              borderWidth: "1px",
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            "&::before, &::after": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },

      MuiInput: {
        styleOverrides: {
          root: {
            "&::before": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          // The props to change the default for.
          // disableRipple: true, // No more ripple, on the whole application 💣!
        },
      },
      MuiCssBaseline: {
        styleOverrides: theme => ({
          a: {
            color: theme.palette.text.primary,
            textDecoration: "none",
          },
        }),
      },
    },
  });
}
