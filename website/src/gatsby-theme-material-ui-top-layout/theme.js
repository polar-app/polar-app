import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
require("typeface-roboto");

// A custom theme for this app
const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: "0.4em",
          // display: "none",
          // position: "fixed",
        },
        "*::-webkit-scrollbar:hover": {
          width: "0.4em",
          // display: "none",
        },
        "*::-webkit-scrollbar-track": {
          "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(159,159,159, 1)",
          outline: "1px solid slategrey",
        },

        html: {
          WebkitFontSmoothing: "auto",
          backgroundColor: "#1C1C1C",
          minHeight: '100vh',
        },
        body: {
          backgroundColor: "#1C1C1C",
          color: "#FFFFFF",
          minHeight: '100vh',
        },

        "#___gatsby": {
          minHeight: '100vh',
        },

        "#gatsby-focus-wrapper": {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        },

        pageTitle: {
          // fontsize: "6rem",
          // fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          // fontWeight: 300,
          // lineHeight: 1.2,
          // letterSpacing: "-0.00833em",
          // paddingLeft: "5%",
          // marginBottom: "5%",
          // borderLeft: "3px solid #816DE8",
          // margiTtop: "5%",
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
          // fontSize: "2.8rem",
          // fontSize: "2.6vw",
          // fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          // fontWeight: 300,
          // lineHeight: 1.2,
          // letterSpacing: '-0.00833em',
          // paddingLeft: '5%',
          // borderLeft: '3px solid #816DE8',
          // fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          // fontStyle: "normal",
          // fontWeight: "500",
          // fontSize: "40px",
          // lineHeight: "44px",
          // letterSpacing: "0.15px",
        },
        h2: {
          // fontSize: "3.75rem",
          // fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          // fontSize: "36px",
          // lineHeight: "38px",
          fontWeight: "300",
          letterSpacing: "-0.00833em",
        },
        h3: {
          // fontSize: "3rem",
          // fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          // fontWeight: 400,
          // lineHeight: 1.167,
          // letterSpacing: "0em",
        },
        h4: {
          // fontSize: "2.125rem",
          // fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          // fontWeight: 400,
          // lineHeight: 1.235,
          // letterSpacing: "0.00735em",
        },
        h5: {
          // fontSize: "1.5rem",
          // fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          // fontWeight: 400,
          // lineHeight: 1.334,
          // letterSpacing: "0em",
        },
        h6: {
          // fontSize: "1.25rem",
          // fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          // fontWeight: 500,
          // lineHeight: 1.6,
          // letterSpacing: "0.0075em",
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
          // fontSize: "1.5vw",
          fontSize: "20px",
          // fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          // fontWeight: 400,
          // lineHeight: 1.5,
          // letterSpacing: "0.00938em",
          fontFamily: "Roboto",
          fontStyle: "normal",
          fontWeight: "300",
          // fontSize: "20px",
          lineHeight: "23px",
          letterSpacing: "0.15px",
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
    error: {
      main: red.A400,
    },
    primary: {
      main: 'rgb(103, 84, 214)'
    }
  },
});

export default theme;
