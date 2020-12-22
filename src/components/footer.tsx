import * as React from "react"
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Button } from "gatsby-material-ui-components";
import { Box } from "@material-ui/core";
import { useBreakpoint } from "gatsby-plugin-breakpoints";
import RedditIcon from "@material-ui/icons/Reddit";
import TwitterIcon from "@material-ui/icons/Twitter";
import {ThirdPartyEmbeds} from "./ThirdPartyEmbeds";
const DiscordIconDark = require("../../content/assets/logos/discord-dark.png");

require("typeface-roboto");

const useStyles = makeStyles((darkMode) => ({
  navChoicesContainer: {
    textTransform: "lowercase",
    marginRight: "25px",
    width: "70%",
    maxWidth: "854px",
    display: "flex",
    justifyContent: "space-between",
  },
  navChoices: {
    fontSize: "14 px",

    fontWeight: 400,
    lineHeight: 1.75,
    letterSpacing: "0.02857em",
    color: "#000",
    textTransform: "none",
    padding: " 2px 8px",
    textAlign: "center",
  },

  socialIcon: {
    minWidth: "28px",
    color: "#424242",
  },
  flexContainerCol: {
    display: "flex",
    flexDirection: "column",
  },
  flexContainerRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  flexContainerRowMobile: {
    display: "flex",
    justifyContent: "space-between",
    // width: "65%",
    minWidth: "469.55px",
  },

  socialIconTab: {
    height: "40px",
    width: "40px",
    color: "#424242",
  },
  socialIconMobile: {
    marginTop: "12px",
    height: "40px",
    width: "40px",
    color: "#424242",
  },
}));

export default function NavBar() {
  const breakpoints = useBreakpoint();

  return (
    <Box style={{ overflow: "hidden" }}>
      {breakpoints.md ? <FooterMobile /> : <FooterDesktop />}
    </Box>
  );
}

function FooterMobile() {
  const breakpoints = useBreakpoint();

  const classes = useStyles();
  return (
    <AppBar
      style={{
        backgroundColor: "#C4C4C4",
        padding: "15px",
        overflow: "hidden",
        top: "100%",
        bottom: "0",
      }}
      position="sticky"
    >
      <Toolbar
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Box
          className={
            breakpoints.ms
              ? classes.flexContainerCol
              : classes.flexContainerRowMobile
          }
        >
          <Box
            // style={{ flexBasis: "50%" }}
            className={classes.flexContainerRow}
          >
            <Box className={classes.flexContainerCol}>
              {/* <Button
                className={classes.navChoices}
                color="inherit"
                href="/docs"
              >
                Demo Videos
              </Button> */}
              <Button
                className={classes.navChoices}
                color="inherit"
                href="/pricing"
              >
                Pricing
              </Button>
              <Button
                className={classes.navChoices}
                color="inherit"
                href="/terms"
              >
                Terms of Service
              </Button>
              <Button
                className={classes.navChoices}
                color="inherit"
                href="/privacy-policy"
              >
                Privacy Policy
              </Button>
            </Box>
            <Box className={classes.flexContainerCol}>
              <Button
                className={classes.navChoices}
                color="inherit"
                href="/blog"
              >
                Blog
              </Button>
              <Button
                className={classes.navChoices}
                color="inherit"
                href="/docs"
              >
                Documentation
              </Button>

              <Button
                className={classes.navChoices}
                color="inherit"
                href="/download"
              >
                Download
              </Button>
            </Box>
          </Box>

          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // flexBasis: "50%",
            }}
          >
            <Button href="https://www.reddit.com/r/PolarBookshelf/">
              <RedditIcon
                className={
                  breakpoints.ms
                    ? classes.socialIconMobile
                    : classes.socialIconTab
                }
              />
            </Button>
            <Button href="https://twitter.com/getpolarized">
              <TwitterIcon
                className={
                  breakpoints.ms
                    ? classes.socialIconMobile
                    : classes.socialIconTab
                }
              />
            </Button>
            <Button href="https://discord.com/invite/GT8MhA6">
              <img
                src={DiscordIconDark}
                className={
                  breakpoints.ms
                    ? classes.socialIconMobile
                    : classes.socialIconTab
                }
              />
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function FooterDesktop() {
  const breakpoints = useBreakpoint();

  const classes = useStyles();
  return (
      <>
        <ThirdPartyEmbeds/>
        <AppBar
          style={{
            backgroundColor: "#C4C4C4",
            padding: 0,
          }}
          position="sticky"
        >
          <Toolbar style={{ display: "flex", justifyContent: "center" }}>
            <Box className={classes.navChoicesContainer}>
              <Button className={classes.navChoices} color="inherit" href="/terms">
                Terms of Service
              </Button>
              <Button
                className={classes.navChoices}
                color="inherit"
                href="/privacy-policy"
              >
                Privacy Policy
              </Button>
              <Button className={classes.navChoices} color="inherit" href="/docs">
                Documentation
              </Button>
              {/* <Button className={classes.navChoices} color="inherit" href="/docs">
                Demo Videos
              </Button> */}
              <Button
                className={classes.navChoices}
                color="inherit"
                href="/pricing"
              >
                Pricing
              </Button>
              <Button className={classes.navChoices} color="inherit" href="/blog">
                Blog
              </Button>
              <Button
                className={classes.navChoices}
                color="inherit"
                href="/download"
              >
                Download
              </Button>
            </Box>

            <Box style={{ marginRight: 30 }}>
              <Button
                className={classes.socialIcon}
                href="https://www.reddit.com/r/PolarBookshelf/"
              >
                <RedditIcon
                  style={{ height: "29px", width: "29px", color: "#424242" }}
                />
              </Button>
              <Button
                className={classes.socialIcon}
                href="https://twitter.com/getpolarized"
              >
                <TwitterIcon
                  style={{ height: "29px", width: "29px", color: "#424242" }}
                />
              </Button>
              <Button
                className={classes.socialIcon}
                href="https://discord.com/invite/GT8MhA6"
              >
                <img
                  src={DiscordIconDark}
                  style={{ marginTop: "5%", height: "31px", width: "32px" }}
                />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </>
  );
}
