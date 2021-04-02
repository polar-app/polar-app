import * as React from "react"
import { makeStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Button } from "gatsby-material-ui-components";
import { Box } from "@material-ui/core";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import MenuIcon from "@material-ui/icons/Menu";
import ListItemText from "@material-ui/core/ListItemText";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import { useBreakpoint } from "gatsby-plugin-breakpoints";
import { withBreakpoints } from "gatsby-plugin-breakpoints";

import RedditIcon from "@material-ui/icons/Reddit";
import TwitterIcon from "@material-ui/icons/Twitter";
import IconButton from "@material-ui/core/IconButton";
const ImgPolarLogo = require("../../content/assets//logos/logo.svg");
import CloseIcon from "@material-ui/icons/Close";
import {CreateAccountButton} from "./CreateAccountButton";
import {Devices} from "polar-shared/src/util/Devices";
import DiscordIcon from "./logos/Discord";


const useStyles = makeStyles((darkMode) => ({
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
    // marginLeft: "5px",
  },
}));

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {breakpoints} = this.props;

    return (
      <React.Fragment>
        {breakpoints.md ? <NavBarMobile /> : <NavBarDesktop />}
      </React.Fragment>
    );
  }
}

// function mobileVsTab(breakpoints) {
//  return {breakpoints.sm ? <NavBarMobile /> : <NavBarTab/>}
// }

function NavBarMobile() {
  const classes = useStyles();
  const breakpoints = useBreakpoint();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    rotate: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    // console.log("ANCHOR: " + state.right);
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };


  const links = Devices.isDesktop() ?
      ["pricing", "docs", "blog", "download", "extension", "forum"] :
      ["docs", "blog"];

  const list = (anchor) => (
    <div className={clsx(classes.list, {
            [classes.fullList]: anchor === "top" || anchor === "bottom",
         })}
         role="presentation"
         onClick={toggleDrawer(anchor, false)}
         onKeyDown={toggleDrawer(anchor, false)}>

      <List>
        <React.Fragment>
          <IconButton>
            <CloseIcon />
          </IconButton>
          {links.map(
            (text, index) => (
              <Box key={ text }>
                <ListItem
                  component={Button}
                  className={classes.navChoices}
                  key={text}
                  href={
                    index === 4
                      ? "/download"
                      : index === 5
                      ? "/chrome-extension"
                      : "/" + text
                  }
                  style={{ paddingLeft: "10%", borderRadius: 0 }}
                >
                  <ListItemText
                    primary={text === "docs" ? "documentation" : text}
                  />
                </ListItem>
                <Divider style={{ marginLeft: "10%", width: "80%" }} />
              </Box>
            )
          )}
        </React.Fragment>
      </List>
    </div>
  );
  return (
    <AppBar color="inherit" position="sticky">
      <Toolbar disableGutters>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Button
            // disableRipple
            // disableElevation
            // disableFocusRipple
            className={
              breakpoints.sm
                ? classes.polarButtonMobile
                : classes.polarButtonTab
            }
            href="/"
            style={{
              // width: "auto",
              marginLeft: "5px",
              // fontSize: "20px",
              // backgroundColor: "transparent",
            }}
          >
            <img
              style={{
                width: "45px",
                height: "35px",
                marginLeft: "0px",
                marginRight: "4px",
              }}
              src={ImgPolarLogo}
            />
            Polar
          </Button>
        </Typography>
        {["right"].map((anchor) => (
          <Box key={ anchor }>
            <Button onClick={toggleDrawer(anchor, true)}>
              <MenuIcon />
            </Button>
            <Drawer
              anchor="right"
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
              variant="temporary"
            >
              {list(anchor)}
            </Drawer>
          </Box>
        ))}
      </Toolbar>
    </AppBar>
  );
}

function NavBarDesktop() {
  const breakpoints = useBreakpoint();

  const classes = useStyles();
  return (
    // <Box style={{ padding: 0 }}>
    <AppBar style={{ padding: 0, margin: 0 }} color="inherit" position="sticky">
      <Toolbar disableGutters>
        <Typography variant="body1">
          <Button
            // disableRipple
            // disableElevation
            // disableFocusRipple
            className={classes.polarButton}
            href="/"
            style={
              {
                // width: "auto",
                // marginLeft: "40px",
                // fontSize: "20px",
                // backgroundColor: "transparent",
              }
            }
          >
            <img
              style={{
                width: "51px",
                height: "41px",
                marginLeft: "0px",
                marginRight: "12px",
              }}
              src={ImgPolarLogo}
            />
            Polar
          </Button>
        </Typography>
        <Box className={classes.navChoicesContainer}>
          <Button
            className={classes.navChoices}
            color="inherit"
            href="/pricing"
          >
            pricing
          </Button>
          <Button className={classes.navChoices} color="inherit" href="/docs">
            documentation
          </Button>
          <Button className={classes.navChoices} color="inherit" href="/blog">
            blog
          </Button>
          <Button className={classes.navChoices}
                  color="inherit"
                  href="/download">
            download
          </Button>
          <Button className={classes.navChoices}
                  color="inherit"
                  href="/chrome-extension">
            extension
          </Button>

          {/*<Button className={classes.navChoices}*/}
          {/*        color="inherit"*/}
          {/*        href="https://forum.getpolarized.io">*/}
          {/*  forum*/}
          {/*</Button>*/}

        </Box>
        {breakpoints.tab ? (
          <p></p>
        ) : (
          <Box style={{ marginRight: 30 }}>
            <Button
              className={classes.socialIcon}
              href="https://www.reddit.com/r/PolarBookshelf/"
              target="_blank"
            >
              {/* <img src={RedditIconLight} className={classes.navIcon} /> */}
              <RedditIcon
                style={{ height: "29px", width: "29px", fill: "#E0E0E0" }}
              />
            </Button>
            <Button
              className={classes.socialIcon}
              href="https://twitter.com/getpolarized"
              target="_blank"
            >
              {/* <img src={TwitterIconLight} className={classes.navIcon} /> */}
              <TwitterIcon style={{ height: "29px", width: "29px", fill: "#E0E0E0" }}
              />
            </Button>
            <Button className={classes.socialIcon}
                    href="https://discord.com/invite/GT8MhA6"
                    target="_blank">
              <DiscordIcon style={{ height: "29px", width: "29px", fill: "#E0E0E0" }}
              />
            </Button>
          </Box>
        )}

        <div style={{marginRight: '10px'}}>
          <CreateAccountButton size="medium"/>
        </div>

      </Toolbar>
    </AppBar>
    // </Box>
  );
}

export default withBreakpoints(NavBar);
