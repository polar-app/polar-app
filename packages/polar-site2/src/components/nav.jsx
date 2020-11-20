"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var styles_1 = require("@material-ui/core/styles");
var AppBar_1 = require("@material-ui/core/AppBar");
var Toolbar_1 = require("@material-ui/core/Toolbar");
var Typography_1 = require("@material-ui/core/Typography");
var gatsby_material_ui_components_1 = require("gatsby-material-ui-components");
var core_1 = require("@material-ui/core");
var List_1 = require("@material-ui/core/List");
var Divider_1 = require("@material-ui/core/Divider");
var ListItem_1 = require("@material-ui/core/ListItem");
var Menu_1 = require("@material-ui/icons/Menu");
var ListItemText_1 = require("@material-ui/core/ListItemText");
var clsx_1 = require("clsx");
var Drawer_1 = require("@material-ui/core/Drawer");
var gatsby_plugin_breakpoints_1 = require("gatsby-plugin-breakpoints");
var gatsby_plugin_breakpoints_2 = require("gatsby-plugin-breakpoints");
var Reddit_1 = require("@material-ui/icons/Reddit");
var Twitter_1 = require("@material-ui/icons/Twitter");
var DiscordIconLight = require("../../content/assets/logos/discord-light.png");
var IconButton_1 = require("@material-ui/core/IconButton");
var ImgPolarLogo = require("../../content/assets//logos/logo.svg");
var Close_1 = require("@material-ui/icons/Close");
var CreateAccountButton_1 = require("./CreateAccountButton");
var Devices_1 = require("polar-shared/src/util/Devices");
var useStyles = styles_1.makeStyles(function (darkMode) { return ({
    list: {
        width: 250,
    },
    fullList: {
        width: "auto",
        overflow: "none",
    },
    navChoicesContainer: {
        marginLeft: "25px",
        textTransform: "lowercase",
        marginRight: "auto",
    },
    navChoices: {
        fontSize: "16px",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontWeight: 300,
        lineHeight: 1.75,
        letterSpacing: "0.02857em",
        textTransform: "lowercase",
        backgroundColor: "transparent !important",
        color: "rgba(224,224,224,.87)",
        padding: "7.5px 12px 7.5 px 12px",
    },
    navIcon: {
        marginTop: "5%",
        height: "31px",
        width: "32px",
    },
    socialIcon: {
        minWidth: "28px",
        backgroundColor: "transparent !important",
    },
    polarButton: {
        width: "auto",
        // marginLeft: "40px",
        fontSize: "27px",
        fontWeight: 700,
        backgroundColor: "transparent !important",
        lineHeight: "40px",
        color: "#e0e0e0",
    },
    polarButtonMobile: {
        width: "auto",
        // marginLeft: "40px",
        fontSize: "27px",
        fontWeight: 700,
        backgroundColor: "transparent !important",
        lineHeight: "40px",
        color: "#e0e0e0",
    },
    polarButtonTab: {
        width: "auto",
        // marginLeft: "40px",
        fontSize: "27px",
        fontWeight: 700,
        backgroundColor: "transparent !important",
        lineHeight: "40px",
        color: "#e0e0e0",
    },
}); });
var NavBar = /** @class */ (function (_super) {
    __extends(NavBar, _super);
    function NavBar(props) {
        return _super.call(this, props) || this;
    }
    NavBar.prototype.render = function () {
        var breakpoints = this.props.breakpoints;
        return (<React.Fragment>
        {breakpoints.md ? <NavBarMobile /> : <NavBarDesktop />}
      </React.Fragment>);
    };
    return NavBar;
}(React.Component));
// function mobileVsTab(breakpoints) {
//  return {breakpoints.sm ? <NavBarMobile /> : <NavBarTab/>}
// }
function NavBarMobile() {
    var classes = useStyles();
    var breakpoints = gatsby_plugin_breakpoints_1.useBreakpoint();
    var _a = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
        rotate: false,
    }), state = _a[0], setState = _a[1];
    var toggleDrawer = function (anchor, open) { return function (event) {
        var _a;
        // console.log("ANCHOR: " + state.right);
        if (event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")) {
            return;
        }
        setState(__assign(__assign({}, state), (_a = {}, _a[anchor] = open, _a)));
    }; };
    var links = Devices_1.Devices.isDesktop() ?
        ["pricing", "docs", "blog", "download", "extension"] :
        ["docs", "blog", "download", "extension"];
    var list = function (anchor) {
        var _a;
        return (<div className={clsx_1.default(classes.list, (_a = {},
            _a[classes.fullList] = anchor === "top" || anchor === "bottom",
            _a))} role="presentation" onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>

      <List_1.default>
        <React.Fragment>
          <IconButton_1.default>
            <Close_1.default />
          </IconButton_1.default>
          {links.map(function (text, index) { return (<core_1.Box>
                <ListItem_1.default component={gatsby_material_ui_components_1.Button} className={classes.navChoices} key={text} href={index === 4
            ? "/download"
            : index === 5
                ? "/chrome-extension"
                : "/" + text} style={{ paddingLeft: "10%", borderRadius: 0 }}>
                  <ListItemText_1.default primary={text === "docs" ? "documentation" : text}/>
                </ListItem_1.default>
                <Divider_1.default style={{ marginLeft: "10%", width: "80%" }}/>
              </core_1.Box>); })}
        </React.Fragment>
      </List_1.default>
    </div>);
    };
    return (<AppBar_1.default color="inherit" position="sticky">
      <Toolbar_1.default disableGutters>
        <Typography_1.default variant="h6" style={{ flexGrow: 1 }}>
          <gatsby_material_ui_components_1.Button 
    // disableRipple
    // disableElevation
    // disableFocusRipple
    className={breakpoints.sm
        ? classes.polarButtonMobile
        : classes.polarButtonTab} href="/" style={{
        // width: "auto",
        marginLeft: "5px",
    }}>
            <img style={{
        width: "45px",
        height: "35px",
        marginLeft: "0px",
        marginRight: "4px",
    }} src={ImgPolarLogo}/>
            Polar
          </gatsby_material_ui_components_1.Button>
        </Typography_1.default>
        {["right"].map(function (anchor) { return (<core_1.Box>
            <gatsby_material_ui_components_1.Button onClick={toggleDrawer(anchor, true)}>
              <Menu_1.default />
            </gatsby_material_ui_components_1.Button>
            <Drawer_1.default anchor="right" open={state[anchor]} onClose={toggleDrawer(anchor, false)} variant="temporary">
              {list(anchor)}
            </Drawer_1.default>
          </core_1.Box>); })}
      </Toolbar_1.default>
    </AppBar_1.default>);
}
function NavBarDesktop() {
    var breakpoints = gatsby_plugin_breakpoints_1.useBreakpoint();
    var classes = useStyles();
    return (
    // <Box style={{ padding: 0 }}>
    <AppBar_1.default style={{ padding: 0, margin: 0 }} color="inherit" position="sticky">
      <Toolbar_1.default disableGutters>
        <Typography_1.default variant="body1">
          <gatsby_material_ui_components_1.Button 
    // disableRipple
    // disableElevation
    // disableFocusRipple
    className={classes.polarButton} href="/" style={{
    // width: "auto",
    // marginLeft: "40px",
    // fontSize: "20px",
    // backgroundColor: "transparent",
    }}>
            <img style={{
        width: "51px",
        height: "41px",
        marginLeft: "0px",
        marginRight: "12px",
    }} src={ImgPolarLogo}/>
            Polar
          </gatsby_material_ui_components_1.Button>
        </Typography_1.default>
        <core_1.Box className={classes.navChoicesContainer}>
          <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/pricing">
            pricing
          </gatsby_material_ui_components_1.Button>
          <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/docs">
            documentation
          </gatsby_material_ui_components_1.Button>
          <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/blog">
            blog
          </gatsby_material_ui_components_1.Button>
          <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/download">
            download
          </gatsby_material_ui_components_1.Button>
          <gatsby_material_ui_components_1.Button className={classes.navChoices} color="inherit" href="/chrome-extension">
            extension
          </gatsby_material_ui_components_1.Button>
        </core_1.Box>
        {breakpoints.tab ? (<p></p>) : (<core_1.Box style={{ marginRight: 30 }}>
            <gatsby_material_ui_components_1.Button className={classes.socialIcon} href="https://www.reddit.com/r/PolarBookshelf/" target="_blank">
              
              <Reddit_1.default style={{ height: "29px", width: "29px", color: "#E0E0E0" }}/>
            </gatsby_material_ui_components_1.Button>
            <gatsby_material_ui_components_1.Button className={classes.socialIcon} href="https://twitter.com/getpolarized" target="_blank">
              
              <Twitter_1.default style={{ height: "29px", width: "29px", color: "#E0E0E0" }}/>
            </gatsby_material_ui_components_1.Button>
            <gatsby_material_ui_components_1.Button className={classes.socialIcon} href="https://discord.com/invite/GT8MhA6" target="_blank">
              <img src={DiscordIconLight} className={classes.navIcon} style={{ height: "29px", width: "29px" }}/>
            </gatsby_material_ui_components_1.Button>
          </core_1.Box>)}

        <div style={{ marginRight: '10px' }}>
          <CreateAccountButton_1.CreateAccountButton size="medium"/>
        </div>

      </Toolbar_1.default>
    </AppBar_1.default>
    // </Box>
    );
}
exports.default = gatsby_plugin_breakpoints_2.withBreakpoints(NavBar);
