import * as React from "react"
import Layout from "../components/layout";
import SEO from "../components/seo";
import {Box} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import {POLAR_RELEASE} from "../components/release";
import {useEffect} from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MacOSLogoImage from "../components/logos/MacOSLogoImage";
import MicrosoftWindowsLogo from "../components/logos/MicrosoftWindowsLogo";
import UbuntuLogo from "../components/logos/UbuntuLogo";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
  background: {
    display: "flex",
    justifyContent: "center",
    mixBlendMode: "normal",
    opacity: 0.85,
    flexGrow: 1,
    height: 'calc(100% - 128px)'
  },

  flexContainerCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",

    justifyContent: "space-between",
    textAlign: "center",
  },

  flexContainerRow: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",

    justifyContent: "space-between",
    textAlign: "center",
  },

  info: {
    fontFamily: "Roboto",
    fontStyle: "italic",
    // fontWeight: "900",

    fontSize: "20px",
    lineHeight: "23px",
    letterSpacing: "0.15px",
  },

  downloadButton: {
    backgroundColor: "#988AEA",
    color: "#424242",
    margin: "25px 25px",
  },

  windowsDisclaim: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    // fontWeight: "900",
    fontSize: "20px",
    lineHeight: "23px",
    letterSpacing: "0.15px",
    margin: "25px 0",
    textAlign: "left",
    width: "100%",
  },

  windowsImg: {
    height: "30vh",
    width: "32vh",
    margin: "0 25px 14% 25px",
  },

  margins: {
    width: "85%",
    display: "flex",
    justifyContent: "center",
  },
  downloadText: {
    marginLeft: "10px",
  },
});

const DownloadForLinux = () => {

  const [active, setActive] = React.useState(false);

  useEffect(() => {

    if (navigator.userAgent.indexOf("Linux") !== -1) {
      setActive(true);
    }

  }, [])


  if (! active) {
    return null;
  }

  return (

      <div>

        <p>
          We provide .deb (Ubuntu and Debian) packages. AppImage for easy
          cross-platform images as well as tar.gz static builds.
        </p>

        <Grid container justify="center" spacing={1}>

          <Grid item>
            <Button href={createDownloadURL('linux-deb')} variant="contained" color="secondary">
              Download .deb (Ubuntu and Debian)
            </Button>
          </Grid>

          <Grid item>
            <Button href={createDownloadURL('linux-targz')} variant="contained" color="secondary">
              Download tar.gz
            </Button>
          </Grid>

          <Grid item>
            <Button href={createDownloadURL('linux-appimage')} variant="contained" color="secondary">
              Download AppImage
            </Button>
          </Grid>
        </Grid>

      </div>

  );
}


function triggerDownloadForURL(url: string) {
    document.location.href = url;
}

function isDev() {

  if (document.location.href.indexOf('localhost') !== -1) {
    return true;
  }

  if (document.location.href.indexOf('127.0.0.1') !== -1) {
    return true;
  }

  return false;

}

type DownloadType = 'mac' | 'win' | 'linux-deb' | 'linux-targz' | 'linux-appimage';

function createDownloadURL(downloadType: DownloadType) {

  switch (downloadType) {
    case "mac":
      return `https://github.com/burtonator/polar-bookshelf/releases/download/v${POLAR_RELEASE}/Polar-${POLAR_RELEASE}.dmg`;
    case "win":
      return `https://github.com/burtonator/polar-bookshelf/releases/download/v${POLAR_RELEASE}/polar-desktop-app-${POLAR_RELEASE}-nsis-x64.exe`;
    case "linux-deb":
      return `https://github.com/burtonator/polar-bookshelf/releases/download/v${POLAR_RELEASE}/polar-desktop-app-${POLAR_RELEASE}-amd64.deb`;
    case "linux-targz":
      return `https://github.com/burtonator/polar-bookshelf/releases/download/v${POLAR_RELEASE}/polar-desktop-app-${POLAR_RELEASE}-x64.tar.gz`;
    case "linux-appimage":
      return `https://github.com/burtonator/polar-bookshelf/releases/download/v${POLAR_RELEASE}/polar-desktop-app-${POLAR_RELEASE}-x86_64.AppImage`;

  }

}

function triggerDownload(): boolean {

    if (isDev()) {
        return false;
    }

    if (navigator.userAgent.indexOf("Mac OS X") !== -1) {
        triggerDownloadForURL(createDownloadURL('mac'));
        return true;
    }

    if (navigator.userAgent.indexOf("Win64") !== -1) {
        triggerDownloadForURL(createDownloadURL('win'));
        return true;
    }

    return false;
}

const DownloadSnackbar = () => {
  return (
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={true}
                message="Download started. Open POLAR below once the download has finished."/>
  );
};

const Download = ({ location }) => {
  const classes = useStyles();
  const [downloadStarted, setDownloadStarted] = React.useState(false);

  useEffect(() => {
    if (triggerDownload()) {
      setDownloadStarted(true);
    }
  }, []);

  return (
    <Layout>
      <SEO title="Download POLAR for the Desktop (MacOS, Windows, and Linux)"
           description="Download POLAR to manage PDFs and EPUBs on your desktop."
           lang="en"/>

      {downloadStarted && <DownloadSnackbar/>}

      <Box className={classes.background}>
        {/* <div className="page-title">Download</div> */}
        <Box className={classes.margins}>
          <Box className={classes.flexContainerCol}>
            <h1>Download POLAR</h1>

            <h2>
              Available on all major desktop platforms including Windows, MacOS, and Linux.
            </h2>

            <div style={{display: 'flex', filter: 'grayscale(1)'}}>
              <div style={{margin: '1em'}}>
                <MicrosoftWindowsLogo/>
              </div>
              <div style={{margin: '1em'}}>
                <MacOSLogoImage/>
              </div>
              <div style={{margin: '1em'}}>
                <UbuntuLogo/>
              </div>
            </div>

            <DownloadForLinux/>

            <Box
              style={{ marginTop: "84px", marginBottom: "26px" }}
              className={classes.info}
            >
              Find all releases in our{" "}
              <a
                // style={{ color: "#867acb" }}
                href="https://github.com/burtonator/polar-bookshelf/releases"
              >
                Github release page.
              </a>
            </Box>
          </Box>
        </Box>
        {/* <p>Get polar here!</p> */}
      </Box>
    </Layout>
  );
};

export default Download;
