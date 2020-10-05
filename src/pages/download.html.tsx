import * as React from "react"
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { Container, Box, Button } from "@material-ui/core";
import { useBreakpoint } from "gatsby-plugin-breakpoints";
import { makeStyles } from "@material-ui/styles";
import {POLAR_RELEASE} from "../components/release";

const ImgAvailableLabeled = require("../../content/assets/logos/available-for-labeled.png");

const useStyles = makeStyles({
  background: {
    display: "flex",
    justifyContent: "center",
    background: `radial-gradient(
      farthest-corner at 0% 100%,
      rgba(255, 255, 255, 0.4),
      #424242
    )`,
    mixdBlendMode: "normal",
    opacity: 0.85,
  },

  flexContainerCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",

    justifyContent: "space-between",
    textAlign: "center",
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
    width: "85%",
    display: "flex",
    justifyContent: "center",
  },
  downloadText: {
    marginLeft: "10px",
  },
});


function triggerDownloadForURL(url: string) {
    document.location.href = url;
}

function triggerDownload(): boolean {

    const winDownload = `https://github.com/burtonator/polar-bookshelf/releases/download/v${POLAR_RELEASE}/polar-bookshelf-${POLAR_RELEASE}-nsis-x64.exe`;
    const macDownload = `https://github.com/burtonator/polar-bookshelf/releases/download/v${POLAR_RELEASE}/polar-bookshelf-${POLAR_RELEASE}.dmg`;

    if (navigator.userAgent.indexOf("Mac OS X") !== -1) {
        triggerDownloadForURL(macDownload);
        return true;
    }

    if (navigator.userAgent.indexOf("Win64") !== -1) {
        triggerDownloadForURL(winDownload);
        return true;
    }

    return false;
}

const Landing = ({ location }) => {
  const breakpoints = useBreakpoint();
  const classes = useStyles();

  return (
    <Layout>
      <SEO
        description="Place to download Polar App"
        title="Download Polar"
        lang="en"
      />
      <Box className={classes.background}>
        {/* <div className="page-title">Download</div> */}
        <Box className={classes.margins}>
          <Box className={classes.flexContainerCol}>
            <h1>Available for: </h1>
            <img
              style={{ width: "85%" }}
              src={ImgAvailableLabeled}
              alt="Logos of compatable OSs or browsers"
            />
            <Box
              style={{ marginTop: "84px", marginBottom: "26px" }}
              className={classes.info}
            >
              Find all releases in our{" "}
              <a
                // style={{ color: "#867acb" }}
                href="https://github.com/burtonator/polar-bookshelf/releases"
              >
                Github release page.
              </a>
            </Box>
          </Box>
        </Box>
        {/* <p>Get polar here!</p> */}
      </Box>
    </Layout>
  );
};

export default Landing;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
