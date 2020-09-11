import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { Container, Box, Button } from "@material-ui/core";
import { useBreakpoint } from "gatsby-plugin-breakpoints";
import { makeStyles } from "@material-ui/styles";
const ImgAvailableLabeled = require("../../content/assets/logos/available-for-labeled.png");
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
const ImgDontRun = require("../../content/assets/utility-images/win-do-not-run-annotated.png");
const ImgRunAnyway = require("../../content/assets/utility-images/win-run-anyway.png");

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

const DOWNLOAD_64_WIN = `https://github.com/burtonator/polar-bookshelf/releases/download/v1.100.13/polar-bookshelf-1.100.13-nsis-x64.exe`;
const DOWNLOAD_32_WIN = `https://github.com/burtonator/polar-bookshelf/releases/download/v1.100.13/polar-bookshelf-1.100.13-nsis-ia32.exe`;

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
            <Box className={classes.flexContainerRow}>
              <Button href={DOWNLOAD_64_WIN} className={classes.downloadButton}>
                <CloudDownloadIcon />
                <Box className={classes.downloadText}>Download 64 Bit</Box>
              </Button>
              <Button href={DOWNLOAD_32_WIN} className={classes.downloadButton}>
                <CloudDownloadIcon />
                <Box className={classes.downloadText}>Download 32 Bit</Box>
              </Button>
            </Box>
            <Box className={classes.flexContainerCol}>
              <Box className={classes.windowsDisclaim}>
                Windows builds require to select ‘run anyway’ after clicking on
                ‘more info’ in the security warning. <br />
                See images below.
              </Box>
              <Box className={classes.windowsDisclaim}>
                We are waiting for Microsoft to approve our digital code signing
                certificate as part of their Windows <br /> Defender program and
                expect to receive it soon.
              </Box>
            </Box>
            <Box
              className={
                breakpoints.sm
                  ? classes.flexContainerCol
                  : classes.flexContainerRow
              }
            >
              <img
                src={ImgDontRun}
                className={classes.windowsImg}
                alt="Bypass Windows Defender pt. 1: 'Click More Info'"
              />
              <img
                src={ImgRunAnyway}
                className={classes.windowsImg}
                alt="Bypass Windows Defender pt. 2: 'Click Run Anyway'"
              />
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
