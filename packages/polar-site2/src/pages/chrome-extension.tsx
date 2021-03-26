import * as React from "react"
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { Container, Box, Button } from "@material-ui/core";
import { useBreakpoint } from "gatsby-plugin-breakpoints";
import { makeStyles } from "@material-ui/styles";
const ImgChromeExtDemo = require("../../content/assets/screenshots/chrome-ext-demo.png");

const useStyles = makeStyles({
  background: {
    display: "flex",
    justifyContent: "center",
    // background: radial-gradient(
    //   farthest-corner at 0% 100%,
    //   rgba(255, 255, 255, 0.4),
    //   #424242
    // );
    mixdBlendMode: "normal",
    opacity: 0.85,
    height: "100vh",
  },

  flexContainerCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",

    justifyContent: "center",
    // textAlign: "center",
  },
  flexContainerColLeft: {
    display: "flex",
    flexDirection: "column",
    // alignContent: "flex-start",
    // alignItems: "flex-start",
    justifyContent: "center",
    // alignSelf: "flex-start",
    // textAlign: "center",
  },

  flexContainerRow: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",

    justifyContent: "space-between",
    textAlign: "center",
  },

  info: {
    fontFamily: "Roboto",
    fontStyle: "italic",
    // fontWeight: "900",
    fontSize: "20px",
    lineHeight: "23px",
    letterSpacing: "0.15px",
  },

  downloadButton: {
    backgroundColor: "#988AEA",
    color: "#424242",
    margin: "25px 25px",
  },

  windowsDisclaim: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    // fontWeight: "900",
    fontSize: "20px",
    lineHeight: "23px",
    letterSpacing: "0.15px",
    margin: "25px 0",
    textAlign: "left",
    width: "100%",
  },

  windowsImg: {
    height: "30vh",
    width: "32vh",
    margin: "0 25px 14% 25px",
  },

  margins: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },

  poppedRectangle: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "rgba(66,66,66,0.2)",
    mixBlendMode: "normal",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
    width: "100%",
    height: "81%",
  },

  poppedRectangleMobile: {
    display: "flex",
    flexDirection: "column",
    alignItems: " center",
    justifyContent: "center",
    backgroundColor: "rgba(66,66,66,0.2)",
    mixBlendMode: "normal",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
    width: "100%",
    // margin: "40% 0",
    // maxHeight: "90vh",
  },

  header: {
    fontFamily: "Roboto",
    fontStyle: "bold",
    // fontWeight: "900",
    fontSize: "40px",
    lineHeight: "47px",
    letterSpacing: "0.15px",
    margin: "25px 0 ",
    textAlign: "left",
    width: "100%",
  },
  headerMobile: {
    fontFamily: "Roboto",
    fontStyle: "bold",
    // fontWeight: "900",
    fontSize: "32px",
    lineHeight: "47px",
    letterSpacing: "0.15px",
    margin: "25px 0 10px 0 ",
    // textAlign: "left",
    width: "100%",
  },

  buttonInstall: {
    backgroundColor: "#6754D6",
    width: "255px",
  },
  hidden: {
    display: "none",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",

    justifyContent: "center",
    padding: "0 0 0 5%",
  },
  textContainerMobile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    // alignContent: "",
    // textAlign: "center",
    // justifyContent: "flex-start",
    // padding: "0 0 0 5%",
  },
  subtitleMobile: {
    fontSize: "16px !important",
  },
});

const Landing = ({ location }) => {
  const breakpoints = useBreakpoint();
  const classes = useStyles();

  return (
    <Layout>
      <SEO title="POLAR Chrome Extension"
           description="Download the POLAR Chrome Extension to capture and clip web content."
           lang="en"/>

      <Box className={classes.background}>
        <Box className={classes.margins}>
          <Box style={{ width: "85%" }} className={classes.flexContainerCol}>
            <Box style={{ padding: "5%" }}
                 className={breakpoints.tab ? classes.poppedRectangleMobile : classes.poppedRectangle}>

              <Box style={{ flexBasis: "66%" }}
                   className={classes.flexContainerCol}>
                <img
                  style={{
                    opacity: "1 !important",
                    padding: "0",
                    objectFit: "contain",
                    // maxWidth: "600px",
                    // minHeight: "213px",
                  }}
                  alt="Polar Annotations Illustration"
                  src={ImgChromeExtDemo}
                />
              </Box>
              <Box
                style={{}}
                className={
                  breakpoints.tab
                    ? classes.textContainerMobile
                    : classes.textContainer
                }
              >
                <h1
                  className={
                    breakpoints.tab ? classes.headerMobile : classes.header
                  }
                >
                  Polar for Chrome
                </h1>
                <p
                  className={breakpoints.md ? classes.subtitleMobile : null}
                  style={{ fontSize: "20px", maxWidth: "379px" }}
                >
                  Effortlessly capture webpages into your personal repository
                </p>
                <Button
                  href="https://chrome.google.com/webstore/detail/polar-pdf-web-and-documen/jkfdkjomocoaljglgddnmhcbolldcafd?hl=en"
                  target="_blank"
                  className={classes.buttonInstall}
                >
                  Install
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* <p>Get polar here!</p> */}
      </Box>
    </Layout>
  );
};

export default Landing;
