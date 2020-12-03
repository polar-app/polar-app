"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var styles_1 = require("@material-ui/core/styles");
var AppBar_1 = require("@material-ui/core/AppBar");
var Toolbar_1 = require("@material-ui/core/Toolbar");
var gatsby_material_ui_components_1 = require("gatsby-material-ui-components");
var core_1 = require("@material-ui/core");
var gatsby_plugin_breakpoints_1 = require("gatsby-plugin-breakpoints");
var Reddit_1 = require("@material-ui/icons/Reddit");
var Twitter_1 = require("@material-ui/icons/Twitter");
var DiscordIconDark = require("../../content/assets/logos/discord-dark.png");
require("typeface-roboto");
var useStyles = styles_1.makeStyles(function (darkMode) { return ({
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
}); });
function NavBar() {
    var breakpoints = gatsby_plugin_breakpoints_1.useBreakpoint();
    return (<core_1.Box style={{ overflow: "hidden" }}>
      {breakpoints.md ? <FooterMobile /> : <FooterDesktop />}
    </core_1.Box>);
}
exports.default = NavBar;
function FooterMobile() {
    var breakpoints = gatsby_plugin_breakpoints_1.useBreakpoint();
    var classes = useStyles();
    return (<AppBar_1.default style={{
        backgroundColor: "#C4C4C4",
        padding: "15px",
        overflow: "hidden",
        top: "100%",
        bottom: "0",
    }} position="sticky">
      <Toolbar_1.default style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
    }}>
        <core_1.Box className={breakpoints.ms
        ? classes.flexContainerCol
        : classes.flexContainerRowMobile}>
          <core_1.Box 
    // style={{ flexBasis: "50%" }}
    className={classes.flexContainerRow}>
            <core_1.Box className={classes.flexContainerCol}>
              
              <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/pricing">
                Pricing
              </gatsby_material_ui_components_1.Button>
              <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/terms">
                Terms of Service
              </gatsby_material_ui_components_1.Button>
              <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/privacy-policy">
                Privacy Policy
              </gatsby_material_ui_components_1.Button>
            </core_1.Box>
            <core_1.Box className={classes.flexContainerCol}>
              <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/blog">
                Blog
              </gatsby_material_ui_components_1.Button>
              <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/docs">
                Documentation
              </gatsby_material_ui_components_1.Button>

              <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/download">
                Download
              </gatsby_material_ui_components_1.Button>
            </core_1.Box>
          </core_1.Box>

          <core_1.Box style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }}>
            <gatsby_material_ui_components_1.Button href="https://www.reddit.com/r/PolarBookshelf/">
              <Reddit_1.default className={breakpoints.ms
        ? classes.socialIconMobile
        : classes.socialIconTab}/>
            </gatsby_material_ui_components_1.Button>
            <gatsby_material_ui_components_1.Button href="https://twitter.com/getpolarized">
              <Twitter_1.default className={breakpoints.ms
        ? classes.socialIconMobile
        : classes.socialIconTab}/>
            </gatsby_material_ui_components_1.Button>
            <gatsby_material_ui_components_1.Button href="https://discord.com/invite/GT8MhA6">
              <img src={DiscordIconDark} className={breakpoints.ms
        ? classes.socialIconMobile
        : classes.socialIconTab}/>
            </gatsby_material_ui_components_1.Button>
          </core_1.Box>
        </core_1.Box>
      </Toolbar_1.default>
    </AppBar_1.default>);
}
function FooterDesktop() {
    var breakpoints = gatsby_plugin_breakpoints_1.useBreakpoint();
    var classes = useStyles();
    return (<AppBar_1.default style={{
        backgroundColor: "#C4C4C4",
        padding: 0,
    }} position="sticky">
      <Toolbar_1.default style={{ display: "flex", justifyContent: "center" }}>
        <core_1.Box className={classes.navChoicesContainer}>
          <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/terms">
            Terms of Service
          </gatsby_material_ui_components_1.Button>
          <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/privacy-policy">
            Privacy Policy
          </gatsby_material_ui_components_1.Button>
          <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/docs">
            Documentation
          </gatsby_material_ui_components_1.Button>
          
          <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/pricing">
            Pricing
          </gatsby_material_ui_components_1.Button>
          <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/blog">
            Blog
          </gatsby_material_ui_components_1.Button>
          <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/download">
            Download
          </gatsby_material_ui_components_1.Button>
        </core_1.Box>

        <core_1.Box style={{ marginRight: 30 }}>
          <gatsby_material_ui_components_1.Button className={classes.socialIcon} href="https://www.reddit.com/r/PolarBookshelf/">
            <Reddit_1.default style={{ height: "29px", width: "29px", color: "#424242" }}/>
          </gatsby_material_ui_components_1.Button>
          <gatsby_material_ui_components_1.Button className={classes.socialIcon} href="https://twitter.com/getpolarized">
            <Twitter_1.default style={{ height: "29px", width: "29px", color: "#424242" }}/>
          </gatsby_material_ui_components_1.Button>
          <gatsby_material_ui_components_1.Button className={classes.socialIcon} href="https://discord.com/invite/GT8MhA6">
            <img src={DiscordIconDark} style={{ marginTop: "5%", height: "31px", width: "32px" }}/>
          </gatsby_material_ui_components_1.Button>
        </core_1.Box>
      </Toolbar_1.default>
    </AppBar_1.default>);
}
