import * as React from "react"
import {Box, makeStyles} from "@material-ui/core";
import {CreateAccountButton} from "./CreateAccountButton";
import createStyles from "@material-ui/styles/createStyles";
const ImgLogoBar = require("../../content/assets/logos/avaliable-logo-bar.png");

const useStyles = makeStyles((theme) =>
  createStyles({
    logoBar: {
      maxWidth: '600px',
      color: theme.palette.text.hint
    },

    logoFrame: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
      alignContent: "center",

      maxWidth: '1200px',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: "3%",
      paddingRight: "3%",
      marginBottom: '85px'
    },

    background: {
    },

    h1: {
      fontSize: '3rem',
      textAlign: "center",
    },

    h2: {
      fontSize: '2rem',
      textAlign: "center",
      marginBottom: "20px",
    }

}));

const AccountWLogos = ({ transparent }) => {
  const classes = useStyles();
  return (
    <Box className={classes.background}>
      <Box className={classes.logoFrame}>

        <h1 className={classes.h1}>
          Get Started with Polar for FREE
        </h1>

        <CreateAccountButton/>

        {/*<div style={{marginTop: '2em'}}>*/}
          <h2 className={classes.h2}>
            Available On
          </h2>
          <Box className={classes.logoBar}>
            <img src={ImgLogoBar} style={{ marginBottom: "3%" }} />
          </Box>

        {/*</div>*/}
      </Box>
    </Box>
  );
};

export default AccountWLogos;
