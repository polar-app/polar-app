import * as React from "react"

import Layout from "../components/layout";
import SEO from "../components/seo";
import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const ImgAnnotations = require("../../content/assets/screenshots/annotations.png");
const ImgDarkPdf = require("../../content/assets/screenshots/dark-pdf-reader.png");
const ImgPdfReader = require("../../content/assets/screenshots/pdf-reader.png");
const ImgPoppedFeatures = require("../../content/assets/screenshots/popped-features.png");
const ImgStatistics = require("../../content/assets/screenshots/statisticsdrop.png");
// // import Fade from "react-reveal/Fade";
import { withBreakpoints } from "gatsby-plugin-breakpoints";
import CreateAccountWLogos from "../components/create-account-plus-logos";

// // import LazyLoad from "react-lazyload";

const styles = {
  background: {
    background: `linear-gradient(rgb(107,109,124), rgb(97,81,192) 35%, 80%, rgb(111,109,134) 90%, rgb(66,66,66)  
    )`,
    mixdBlendMode: "normal",
    // maxWidth: "100vw",
    // opacity: 0.85,
  },
  backgroundMobile: {
    background: `linear-gradient(rgb(107,109,124), rgb(126,110,220) 35%, 80%, rgb(111,109,134) 90%, rgb(133,131,144)  
    )`,
    mixdBlendMode: "normal",
    overflow: "hidden",

    // opacity: 0.85,
  },
  pageContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",

    height: "100%",
    width: "90vw",
    overflowX: "hidden",
    margin: "0 auto",
  },

  flexContainerColInfoRight: {
    display: "flex",
    flexDirection: "column",
    // alignContent: "space-around",
    textAlign: "right",
    flexBasis: "45%",
    alignItems: "flex-end",
    padding: "4% 12% 4% 0%",
    // marginLeft: "4%",

    // minWidth: "492px !important",
    justifyContent: "center",
    // textAlign: "center",
  },
  flexContainerColInfoLeft: {
    display: "flex",
    flexDirection: "column",
    flexBasis: "45%",
    padding: "4% 0% 4% 8%",
    // marginRight: "4%",
    // alignItems: "left",
    // minWidth: "492px !important",

    // alignItems: "space-around",
    justifyContent: "center",
    // textAlign: "center",
  },

  flexContainerRow: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",

    justifyContent: "space-between",
    textAlign: "center",
  },
  flexContainerCol: {
    display: "flex",

    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",

    justifyContent: "space-between",
    textAlign: "center",
  },

  subtitle: {
    fontFamily: "Roboto",
    // fontStyle: "italic",
    // fontWeight: "900",
    // textAlign: "right",
    fontSize: "20px",
    lineHeight: "23px",
    letterSpacing: "0.15px",
    maxWidth: "450px !important",
    marginTop: "0px",
  },
  subtitleMobile: {
    fontFamily: "Roboto",
    // fontStyle: "italic",
    // fontWeight: "900",
    // textAlign: "right",
    fontSize: "16px",
    lineHeight: "18px",
    letterSpacing: "0.15px",
    maxWidth: "450px !important",
    marginTop: "0px",
    textAlign: "center",
  },

  downloadButton: {
    backgroundColor: "#988AEA",
    color: "#424242",
    margin: "25px 25px",
  },

  contentContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  header: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 900,
    fontSize: "32px",
    lineHeight: "30px",
    letterSpacing: "0.15px",
  },
  headerMobile: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 900,
    fontSize: "24px",
    lineHeight: "28px",
    letterSpacing: "0.15px",
  },

  buttonInstall: {
    backgroundColor: "#6754D6",
    width: "255px",
    minHeight: "36px",
  },
  hidden: {
    display: "none",
  },
  evenPageFrame: { display: "flex" },
  evenPageFrameMobile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "5%",
  },

  oddPageFrameMobile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "5%",
  },
  oddPageFrame: {
    display: "flex",
    // width: "100%",
    // alignContent: "space-between",
  },

  image: {
    objectFit: "cover",

    maxHeight: "52vh",
  },
  imageBox: {
    flexBasis: "55%",
    padding: "4%",
  },

  pageTitleMobile: {
    fontSize: "30px",
    margin: "40px auto 20px auto",
  },
};

class Features extends React.Component {
  // const Features = ({ location }) => {
  //   const breakpoints = useBreakpoint();
  constructor(props) {
    super(props);
    // classes = props;
  }
  render() {
    const { classes } = this.props;
    const { breakpoints } = this.props;
    return breakpoints.md ? (
      <Layout>
        <SEO
          description="A description of the main polar features"
          title="Features"
          lang="en"
        />
        <Box className={classes.backgroundMobile}>
          <Box className={classes.pageContainer}>
            <h1
              className={breakpoints.sm ? classes.pageTitleMobile : null}
              style={{}}
            >
              Features
            </h1>
            <Box className={classes.contentContainer}>
              <Box className={classes.evenPageFrameMobile}>
                <Box className={classes.flexContainerCol}>
                  <p
                    className={
                      breakpoints.sm ? classes.headerMobile : classes.header
                    }
                  >
                    A Network of Documents
                  </p>
                  <Box className={classes.imageBox}>
                    {/* <LazyLoad offset={100} once height={"100%"}> */}
                    {/* <Fade left> */}
                    <img
                      className={classes.image}
                      src={ImgPoppedFeatures}
                      alt="Polar App landing page screenshot."
                    />
                    {/* </Fade> */}
                    {/* </LazyLoad> */}
                  </Box>
                  <p className={classes.subtitleMobile}>
                    Consolidate and streamline your reading. A document manager
                    for pdfs, epubs, webpages, and ebooks. Read, track your
                    progress, and extract information
                  </p>
                </Box>
              </Box>
              <Box className={classes.oddPageFrameMobile}>
                <Box className={classes.flexContainerCol}>
                  <p
                    className={
                      breakpoints.sm ? classes.headerMobile : classes.header
                    }
                  >
                    Annotations and Notes{" "}
                  </p>
                  <Box className={classes.imageBox}>
                    {/* <LazyLoad offset={100} once height={"100%"}> */}
                    {/* <Fade left> */}

                    <img
                      className={classes.image}
                      src={ImgAnnotations}
                      alt="Polar App annotations and notes screenshot"
                    />
                    {/* </Fade> */}
                    {/* </LazyLoad> */}
                  </Box>
                  <p className={classes.subtitleMobile}>
                    Build a knowledge base from your annotations across files.
                    Cross-reference, search, tag, sort, comment, and manage
                    annotations in one place.
                  </p>
                </Box>
              </Box>
              <Box className={classes.evenPageFrameMobile}>
                <Box className={classes.flexContainerCol}>
                  <p
                    className={
                      breakpoints.sm ? classes.headerMobile : classes.header
                    }
                  >
                    Document Viewer
                  </p>
                  <Box className={classes.imageBox}>
                    {/* <LazyLoad offset={100} once height={"100%"}> */}
                    {/* <Fade left> */}
                    <img
                      className={classes.image}
                      src={ImgPdfReader}
                      alt="Polar App pdf reader screenshot"
                    />
                    {/* </Fade> */}
                    {/* </LazyLoad> */}
                  </Box>
                  <p className={classes.subtitleMobile}>
                    Optimize your learning with an integrated reader. Directly
                    see all notes, highlights, and comments.
                  </p>
                </Box>
              </Box>
              <Box className={classes.oddPageFrameMobile}>
                <Box className={classes.flexContainerCol}>
                  <p
                    className={
                      breakpoints.sm ? classes.headerMobile : classes.header
                    }
                  >
                    Statistics
                  </p>
                  <Box className={classes.imageBox}>
                    {/* <LazyLoad offset={100} once height={"100%"}> */}
                    {/* <Fade left> */}
                    <img
                      className={classes.image}
                      src={ImgStatistics}
                      alt="Polar App statistics page screenshot"
                    />
                    {/* </Fade> */}
                    {/* </LazyLoad> */}
                  </Box>
                  <p className={classes.subtitleMobile}>
                    Motivate yourself with integrated statistics. Set daily
                    goals, track your reading, and measure your progress.
                  </p>
                </Box>
              </Box>
              <Box
                // style={{ marginBottom: "10%" }}
                className={classes.evenPageFrameMobile}
              >
                <Box className={classes.flexContainerCol}>
                  <p
                    className={
                      breakpoints.sm ? classes.headerMobile : classes.header
                    }
                  >
                    Incremental Reading
                  </p>
                  <Box className={classes.imageBox}>
                    {/* <LazyLoad offset={100} once height={"100%"}> */}
                    {/* <Fade left> */}
                    <img
                      className={classes.image}
                      src={ImgDarkPdf}
                      alt="Polar App pdf reader dark-mode screenshot"
                    />
                    {/* </Fade> */}
                    {/* </LazyLoad> */}
                  </Box>
                  <p className={classes.subtitleMobile}>
                    Read multiple documents in parallel, manage reading queue,
                    and track progress with flags, tags, and more.
                  </p>
                </Box>
              </Box>
            </Box>
          </Box>
          <CreateAccountWLogos transparent={true} />
        </Box>
      </Layout>
    ) : (
      <Layout>
        <SEO description="The Polar Homepage" title="Features" />
        <Box className={classes.background}>
          <Box
            style={{ overflowX: "hidden" }}
            className={classes.pageContainer}
          >
            {/* <div className="page-title">Download</div> */}
            <h1 style={{ margin: "3% auto" }}>Features</h1>
            <Box className={classes.contentContainer}>
              <Box className={classes.evenPageFrame}>
                <Box className={classes.flexContainerColInfoLeft}>
                  {/* <Fade up> */}
                  <p className={classes.header}>A Network of Documents</p>
                  <p className={classes.subtitle}>
                    Consolidate and streamline your reading. A document manager
                    for pdfs, epubs, webpages, and ebooks. Read, track your
                    progress, and extract information
                  </p>
                  {/* </Fade> */}
                </Box>

                <Box className={classes.imageBox}>
                  {/* <Fade left> */}
                  {/* <LazyLoad offset={100} once height={"100%"}> */}
                  <img
                    className={classes.image}
                    src={ImgPoppedFeatures}
                    alt="Polar App landing page screenshot."
                  />
                  {/* </LazyLoad> */}
                  {/* </Fade> */}
                </Box>
              </Box>
              <Box className={classes.oddPageFrame}>
                <Box className={classes.imageBox}>
                  {/* <Fade left> */}
                  {/* <LazyLoad offset={100} once height={"100%"}> */}
                  <img
                    className={classes.image}
                    src={ImgAnnotations}
                    alt="Polar App annotations and notes screenshot"
                  />
                  {/* </LazyLoad> */}
                  {/* </Fade> */}
                </Box>
                <Box className={classes.flexContainerColInfoRight}>
                  {/* <Fade up> */}
                  <p className={classes.header}>Annotations and Notes </p>

                  <p className={classes.subtitle}>
                    Build a knowledge base from your annotations across files.
                    Cross-reference, search, tag, sort, comment, and manage
                    annotations in one place.
                  </p>
                  {/* </Fade> */}
                </Box>
              </Box>
              <Box className={classes.evenPageFrame}>
                <Box className={classes.flexContainerColInfoLeft}>
                  {/* <Fade up> */}
                  <p className={classes.header}>Document Viewer</p>
                  <p className={classes.subtitle}>
                    Optimize your learning with an integrated reader. Directly
                    see all notes, highlights, and comments.
                  </p>
                  {/* </Fade> */}
                </Box>
                <Box className={classes.imageBox}>
                  {/* <Fade left> */}
                  {/* <LazyLoad offset={100} once height={"100%"}> */}
                  <img
                    className={classes.image}
                    src={ImgPdfReader}
                    alt="Polar App pdf reader screenshot"
                  />
                  {/* </LazyLoad> */}
                  {/* </Fade> */}
                </Box>
              </Box>
              <Box className={classes.oddPageFrame}>
                <Box className={classes.imageBox}>
                  {/* <Fade left> */}
                  {/* <LazyLoad offset={100} once height={"100%"}> */}
                  <img
                    className={classes.image}
                    src={ImgStatistics}
                    alt="Polar App statistics page screenshot"
                  />
                  {/* </LazyLoad> */}
                  {/* </Fade> */}
                </Box>
                <Box className={classes.flexContainerColInfoRight}>
                  {/* <Fade up> */}
                  <p className={classes.header}>Statistics</p>

                  <p className={classes.subtitle}>
                    Motivate yourself with integrated statistics. Set daily
                    goals, track your reading, and measure your progress.
                  </p>
                  {/* </Fade> */}
                </Box>
              </Box>
              <Box className={classes.evenPageFrame}>
                <Box className={classes.flexContainerColInfoLeft}>
                  {/* <Fade up> */}
                  <p className={classes.header}>Incremental Reading</p>
                  <p className={classes.subtitle}>
                    Read multiple documents in parallel, manage reading queue,
                    and track progress with flags, tags, and more.
                  </p>
                  {/* </Fade> */}
                </Box>
                <Box className={classes.imageBox}>
                  {/* <Fade left> */}
                  {/* <LazyLoad offset={100} once height={"100%"}> */}
                  <img
                    className={classes.image}
                    src={ImgDarkPdf}
                    alt="Polar App pdf reader dark-mode screenshot"
                  />
                  {/* </LazyLoad> */}
                  {/* </Fade> */}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <CreateAccountWLogos transparent={false} />
      </Layout>
    );
  }
}

// export default Features;
export default withStyles(styles)(withBreakpoints(Features));
