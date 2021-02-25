"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var core_1 = require("@material-ui/core");
var CreateAccountButton_1 = require("./CreateAccountButton");
var ImgLogoBar = require("../../content/assets/logos/avaliable-logo-bar.png");
var useStyles = core_1.makeStyles({
    logoBar: {},
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
        height: '50vh'
    },
    background: {},
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
var AccountWLogos = function (_a) {
    var transparent = _a.transparent;
    var classes = useStyles();
    return (<core_1.Box className={classes.background}>
      <core_1.Box className={classes.logoFrame}>

        <h1 className={classes.h1}>
          Get Started with Polar for FREE
        </h1>

        <CreateAccountButton_1.CreateAccountButton />

        
        
        
        
        
        
        

        
      </core_1.Box>
    </core_1.Box>);
};
exports.default = AccountWLogos;
