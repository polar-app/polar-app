import React from "react";
import { useBreakpoint } from "gatsby-plugin-breakpoints";
import { Container, Box, makeStyles } from "@material-ui/core";
import { Button } from "gatsby-material-ui-components";
const ImgLogoBar = require("../../content/assets/logos/avaliable-logo-bar.png");
const ImgLogoBarMobile = require("../../content/assets/logos/avaliable-logo-bar-mobile.png");

const useStyles = makeStyles({
  buttonAcc: {
    textTransform: "none",
    marginTop: "5%",
    marginBottom: "8px",
    backgroundColor: "#6754D6",
    // width: "17vw",
    // height: "90vh",
    width: "255px",
    height: "45px",
  },
  buttonAccMobile: {
    textTransform: "none",
    marginTop: "5%",
    marginBottom: "8px",
    backgroundColor: "#6754D6",
    width: "203px",
    height: "46.21px",
  },
  logoBar: {
    width: "36%",
    minWidth: "600px",
  },
  logoBarMobile: {
    width: "85%",
  },

  logoFrame: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    /* margin: 0, */
    /* marginBottom: 50px, */

    width: "100vw",
    paddingLeft: "3%",
    paddingRight: "3%",
    /* paddingBottom: 2%, */

    position: "relative",
    height: "400px",
  },

  logoFrameMobile: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    /* margin: 0, */
    /* marginBottom: 50px, */

    width: "100vw",
    paddingLeft: "3%",
    paddingRight: "3%",
    /* paddingBottom: 2%, */

    position: "relative",
    height: "300px",
  },
  background: {
    backgroundColor: "#424242",
  },
  backgroundTransparent: {
    // background: "transparent",
  },
});

const AccountWLogos = ({ transparent }) => {
  const classes = useStyles();
  const breakpoints = useBreakpoint();
  return (
    <Box
      className={
        transparent ? classes.backgroundTransparent : classes.background
      }
    >
      <Box
        className={breakpoints.md ? classes.logoFrameMobile : classes.logoFrame}
      >
        <Button
          className={
            breakpoints.md ? classes.buttonAccMobile : classes.buttonAcc
          }
          href="https://beta.getpolarized.io/login"
          target="_blank"
        >
          Create Account
        </Button>
        <h1
          style={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: 300,
            marginBottom: "40px",
          }}
        >
          Avaliable on
        </h1>
        {breakpoints.sm ? (
          <Box className={classes.logoBarMobile}>
            <img src={ImgLogoBarMobile} />
          </Box>
        ) : (
          <Box className={classes.logoBar}>
            <img src={ImgLogoBar} style={{ marginBottom: "3%" }} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AccountWLogos;
