"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var core_1 = require("@material-ui/core");
var CreateAccountButton_1 = require("./CreateAccountButton");
var createStyles_1 = require("@material-ui/styles/createStyles");
var ImgLogoBar = require("../../content/assets/logos/avaliable-logo-bar.png");
var useStyles = core_1.makeStyles(function (theme) {
    return createStyles_1.default({
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
            marginTop: '100px'
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
    });
});
var AccountWLogos = function (_a) {
    var transparent = _a.transparent;
    var classes = useStyles();
    return (<core_1.Box className={classes.background}>
      <core_1.Box className={classes.logoFrame}>

        <h1 className={classes.h1}>
          Get Started with Polar for FREE
        </h1>

        <CreateAccountButton_1.CreateAccountButton />


          <h2 className={classes.h2}>
            Available On
          </h2>
          <core_1.Box className={classes.logoBar}>
            <img src={ImgLogoBar} style={{ marginBottom: "3%" }}/>
          </core_1.Box>


      </core_1.Box>
    </core_1.Box>);
};
exports.default = AccountWLogos;
