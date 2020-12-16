import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
import "./blogPost.css";

// A custom theme for this app
const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          WebkitFontSmoothing: "auto",
          backgroundColor: "#222222",
        },
        body: {
          backgroundColor: "#222222",
          color: "#FFFFFF",
        },

        pageTitle: {
          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          fontStyle: "normal",
          fontWeight: "900",
          fontSize: "40px",
          lineHeight: "47px",
          letterSpacing: "0.15px",
        },

        strong: {
          fontWeight: "900",
        },

        h1: {
          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          fontStyle: "normal",
          fontWeight: "500",
          fontSize: "28px",
          lineHeight: "44px",
          letterSpacing: "0.15px",
        },
        h2: {
          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          fontStyle: "normal",
          fontWeight: "400",
          fontSize: "24px",
          lineHeight: "24px",
          letterSpacing: "0.15px",
        },
        h3: {
          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          fontStyle: "normal",
          fontWeight: "400",
          fontSize: "20px",
          lineHeight: "24px",
          letterSpacing: "0.15px",
        },
        h4: {
          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          fontStyle: "normal",
          fontWeight: "400",
          fontSize: "18px",
          lineHeight: "24px",
          letterSpacing: "0.15px",
        },

        img: {
          maxHeight: "100%",
          maxWidth: "100%",
          display: "block",
          // margin: "auto",
        },
        a: {
          color: "#816DE8",
        },
        p: {
          fontSize: "18px",

          fontFamily: "Roboto",
          fontStyle: "normal",
          fontWeight: "300",
          // fontSize: "20px",
          lineHeight: "1.4em",
          letterSpacing: "0.05px",

          color: "#FFFFFF",
        },

        li: {
          fontSize: "18px",

          fontFamily: "Roboto",
          fontStyle: "normal",
          fontWeight: "300",
          // fontSize: "20px",
          lineHeight: "1.4em",
          letterSpacing: "0.05px",

          color: "#FFFFFF",
        },
        MuiAppBar: {
          backgroundColor: "#333333",
          color: "black",
          marginBottom: "5%",
          colorDefault: "#333333",
        },
      },
    },
  },
  palette: {
    type: "dark",
    primary: {
      main: "#424242",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#222",
    },
  },
});

export default theme;
