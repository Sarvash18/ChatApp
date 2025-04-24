import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "../styles/globals.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0e0e10",
      paper: "#1a1a1d",
    },
    primary: {
      main: "#9c6eff",
    },
    text: {
      primary: "#e3e3e3",
      secondary: "#aaa",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
