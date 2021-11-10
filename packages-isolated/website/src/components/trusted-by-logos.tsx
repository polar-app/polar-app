import * as React from "react"

const ImgTrustedByRows = require("../../content/assets/logos/trusted-by-2-rows.png");
const ImgTrustedBy = require("../../content/assets/logos/trusted-logos.png");

import { useBreakpoint } from "gatsby-plugin-breakpoints";

import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  logoContainerOuter: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    margin: "40px auto",
    width: "85vw",
    // alignContent: "center",
  },
  flexContainer: {
    display: "flex",
    flexDirection: "column",
    // flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",

    marginTop: '30px',
    marginBottom: '30px',

    // alignContent: "flex-end",
    width: "100vw",
    // alignContent: "center",
  },
  logoContainerMobile: {
    display: "flex",
    // flexWrap: "wrap",
    justifyContent: "space-evenly",
    margin: "5px 4%",

    // alignContent: "flex-end",
    width: "85%",
    // alignContent: "center",
  },
  logo: {
    padding: "15px 2%",
    // maxWidth: "200px",
    objectFit: "contain",
    // width: "calc(100% * (1/4) - 10px - 1px)",
    // flexBasis: "5.5%",
    // flexGrow: 3,
  },

  logoMobile: {
    padding: "15px 2%",
    // maxWidth: "200px",
    objectFit: "contain",
    // width: "calc(100% * (1/4) - 10px - 1px)",
    // flexBasis: "5.5%",
    flexGrow: 1,
  },
});

const TrustedByLogos = () => {
  const breakpoints = useBreakpoint();
  const classes = useStyles();
  return (
    <Box
      className={
        classes.flexContainer
      }
    >
      <p>Trusted by users at</p>

      {breakpoints.md ? (
        <img style={{ width: "85%" }} src={ImgTrustedByRows} />
      ) : (
        <img style={{ width: "85%" }} src={ImgTrustedBy} />
      )}
    </Box>
  );
};

export default TrustedByLogos;
