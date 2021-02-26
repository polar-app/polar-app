"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ImgTrustedByRows = require("../../content/assets/logos/trusted-by-2-rows.png");
var ImgTrustedBy = require("../../content/assets/logos/trusted-logos.png");
var gatsby_plugin_breakpoints_1 = require("gatsby-plugin-breakpoints");
var core_1 = require("@material-ui/core");
var styles_1 = require("@material-ui/styles");
var useStyles = styles_1.makeStyles({
    logoContainerOuter: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        margin: "40px auto",
        width: "85vw",
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
    },
    logoContainerMobile: {
        display: "flex",
        // flexWrap: "wrap",
        justifyContent: "space-evenly",
        margin: "5px 4%",
        // alignContent: "flex-end",
        width: "85%",
    },
    logo: {
        padding: "15px 2%",
        // maxWidth: "200px",
        objectFit: "contain",
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
var TrustedByLogos = function () {
    var breakpoints = gatsby_plugin_breakpoints_1.useBreakpoint();
    var classes = useStyles();
    return (<core_1.Box className={classes.flexContainer}>
      <p>Trusted by users at</p>

      {breakpoints.md ? (<img style={{ width: "85%" }} src={ImgTrustedByRows}/>) : (<img style={{ width: "85%" }} src={ImgTrustedBy}/>)}
    </core_1.Box>);
};
exports.default = TrustedByLogos;
