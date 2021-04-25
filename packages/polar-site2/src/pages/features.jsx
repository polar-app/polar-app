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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var layout_1 = require("../components/layout");
var seo_1 = require("../components/seo");
var core_1 = require("@material-ui/core");
var styles_1 = require("@material-ui/styles");
var ImgAnnotations = require("../../content/assets/screenshots/annotations.png");
var ImgDarkPdf = require("../../content/assets/screenshots/dark-pdf-reader.png");
var ImgPdfReader = require("../../content/assets/screenshots/pdf-reader.png");
var ImgPoppedFeatures = require("../../content/assets/screenshots/popped-features.png");
var ImgStatistics = require("../../content/assets/screenshots/statisticsdrop.png");
// // import Fade from "react-reveal/Fade";
var gatsby_plugin_breakpoints_1 = require("gatsby-plugin-breakpoints");
var create_account_plus_logos_1 = require("../components/create-account-plus-logos");
// // import LazyLoad from "react-lazyload";
var styles = {
    background: {
        background: "linear-gradient(rgb(107,109,124), rgb(97,81,192) 35%, 80%, rgb(111,109,134) 90%, rgb(66,66,66)  \n    )",
        mixdBlendMode: "normal",
    },
    backgroundMobile: {
        background: "linear-gradient(rgb(107,109,124), rgb(126,110,220) 35%, 80%, rgb(111,109,134) 90%, rgb(133,131,144)  \n    )",
        mixdBlendMode: "normal",
        overflow: "hidden",
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
var Features = /** @class */ (function (_super) {
    __extends(Features, _super);
    // const Features = ({ location }) => {
    //   const breakpoints = useBreakpoint();
    function Features(props) {
        return _super.call(this, props) || this;
        // classes = props;
    }
    Features.prototype.render = function () {
        var classes = this.props.classes;
        var breakpoints = this.props.breakpoints;
        return breakpoints.md ? (<layout_1.default>
        <seo_1.default description="A description of the main polar features" title="Features" lang="en"/>
        <core_1.Box className={classes.backgroundMobile}>
          <core_1.Box className={classes.pageContainer}>
            <h1 className={breakpoints.sm ? classes.pageTitleMobile : null} style={{}}>
              Features
            </h1>
            <core_1.Box className={classes.contentContainer}>
              <core_1.Box className={classes.evenPageFrameMobile}>
                <core_1.Box className={classes.flexContainerCol}>
                  <p className={breakpoints.sm ? classes.headerMobile : classes.header}>
                    A Network of Documents
                  </p>
                  <core_1.Box className={classes.imageBox}>
                    
                    
                    <img className={classes.image} src={ImgPoppedFeatures} alt="Polar App landing page screenshot."/>
                    
                    
                  </core_1.Box>
                  <p className={classes.subtitleMobile}>
                    Consolidate and streamline your reading. A document manager
                    for pdfs, epubs, webpages, and ebooks. Read, track your
                    progress, and extract information
                  </p>
                </core_1.Box>
              </core_1.Box>
              <core_1.Box className={classes.oddPageFrameMobile}>
                <core_1.Box className={classes.flexContainerCol}>
                  <p className={breakpoints.sm ? classes.headerMobile : classes.header}>
                    Annotations and Notes{" "}
                  </p>
                  <core_1.Box className={classes.imageBox}>
                    
                    

                    <img className={classes.image} src={ImgAnnotations} alt="Polar App annotations and notes screenshot"/>
                    
                    
                  </core_1.Box>
                  <p className={classes.subtitleMobile}>
                    Build a knowledge base from your annotations across files.
                    Cross-reference, search, tag, sort, comment, and manage
                    annotations in one place.
                  </p>
                </core_1.Box>
              </core_1.Box>
              <core_1.Box className={classes.evenPageFrameMobile}>
                <core_1.Box className={classes.flexContainerCol}>
                  <p className={breakpoints.sm ? classes.headerMobile : classes.header}>
                    Document Viewer
                  </p>
                  <core_1.Box className={classes.imageBox}>
                    
                    
                    <img className={classes.image} src={ImgPdfReader} alt="Polar App pdf reader screenshot"/>
                    
                    
                  </core_1.Box>
                  <p className={classes.subtitleMobile}>
                    Optimize your learning with an integrated reader. Directly
                    see all notes, highlights, and comments.
                  </p>
                </core_1.Box>
              </core_1.Box>
              <core_1.Box className={classes.oddPageFrameMobile}>
                <core_1.Box className={classes.flexContainerCol}>
                  <p className={breakpoints.sm ? classes.headerMobile : classes.header}>
                    Statistics
                  </p>
                  <core_1.Box className={classes.imageBox}>
                    
                    
                    <img className={classes.image} src={ImgStatistics} alt="Polar App statistics page screenshot"/>
                    
                    
                  </core_1.Box>
                  <p className={classes.subtitleMobile}>
                    Motivate yourself with integrated statistics. Set daily
                    goals, track your reading, and measure your progress.
                  </p>
                </core_1.Box>
              </core_1.Box>
              <core_1.Box 
        // style={{ marginBottom: "10%" }}
        className={classes.evenPageFrameMobile}>
                <core_1.Box className={classes.flexContainerCol}>
                  <p className={breakpoints.sm ? classes.headerMobile : classes.header}>
                    Incremental Reading
                  </p>
                  <core_1.Box className={classes.imageBox}>
                    
                    
                    <img className={classes.image} src={ImgDarkPdf} alt="Polar App pdf reader dark-mode screenshot"/>
                    
                    
                  </core_1.Box>
                  <p className={classes.subtitleMobile}>
                    Read multiple documents in parallel, manage reading queue,
                    and track progress with flags, tags, and more.
                  </p>
                </core_1.Box>
              </core_1.Box>
            </core_1.Box>
          </core_1.Box>
          <create_account_plus_logos_1.default transparent={true}/>
        </core_1.Box>
      </layout_1.default>) : (<layout_1.default>
        <seo_1.default description="The Polar Homepage" title="Features"/>
        <core_1.Box className={classes.background}>
          <core_1.Box style={{ overflowX: "hidden" }} className={classes.pageContainer}>
            
            <h1 style={{ margin: "3% auto" }}>Features</h1>
            <core_1.Box className={classes.contentContainer}>
              <core_1.Box className={classes.evenPageFrame}>
                <core_1.Box className={classes.flexContainerColInfoLeft}>
                  
                  <p className={classes.header}>A Network of Documents</p>
                  <p className={classes.subtitle}>
                    Consolidate and streamline your reading. A document manager
                    for pdfs, epubs, webpages, and ebooks. Read, track your
                    progress, and extract information
                  </p>
                  
                </core_1.Box>

                <core_1.Box className={classes.imageBox}>
                  
                  
                  <img className={classes.image} src={ImgPoppedFeatures} alt="Polar App landing page screenshot."/>
                  
                  
                </core_1.Box>
              </core_1.Box>
              <core_1.Box className={classes.oddPageFrame}>
                <core_1.Box className={classes.imageBox}>
                  
                  
                  <img className={classes.image} src={ImgAnnotations} alt="Polar App annotations and notes screenshot"/>
                  
                  
                </core_1.Box>
                <core_1.Box className={classes.flexContainerColInfoRight}>
                  
                  <p className={classes.header}>Annotations and Notes </p>

                  <p className={classes.subtitle}>
                    Build a knowledge base from your annotations across files.
                    Cross-reference, search, tag, sort, comment, and manage
                    annotations in one place.
                  </p>
                  
                </core_1.Box>
              </core_1.Box>
              <core_1.Box className={classes.evenPageFrame}>
                <core_1.Box className={classes.flexContainerColInfoLeft}>
                  
                  <p className={classes.header}>Document Viewer</p>
                  <p className={classes.subtitle}>
                    Optimize your learning with an integrated reader. Directly
                    see all notes, highlights, and comments.
                  </p>
                  
                </core_1.Box>
                <core_1.Box className={classes.imageBox}>
                  
                  
                  <img className={classes.image} src={ImgPdfReader} alt="Polar App pdf reader screenshot"/>
                  
                  
                </core_1.Box>
              </core_1.Box>
              <core_1.Box className={classes.oddPageFrame}>
                <core_1.Box className={classes.imageBox}>
                  
                  
                  <img className={classes.image} src={ImgStatistics} alt="Polar App statistics page screenshot"/>
                  
                  
                </core_1.Box>
                <core_1.Box className={classes.flexContainerColInfoRight}>
                  
                  <p className={classes.header}>Statistics</p>

                  <p className={classes.subtitle}>
                    Motivate yourself with integrated statistics. Set daily
                    goals, track your reading, and measure your progress.
                  </p>
                  
                </core_1.Box>
              </core_1.Box>
              <core_1.Box className={classes.evenPageFrame}>
                <core_1.Box className={classes.flexContainerColInfoLeft}>
                  
                  <p className={classes.header}>Incremental Reading</p>
                  <p className={classes.subtitle}>
                    Read multiple documents in parallel, manage reading queue,
                    and track progress with flags, tags, and more.
                  </p>
                  
                </core_1.Box>
                <core_1.Box className={classes.imageBox}>
                  
                  
                  <img className={classes.image} src={ImgDarkPdf} alt="Polar App pdf reader dark-mode screenshot"/>
                  
                  
                </core_1.Box>
              </core_1.Box>
            </core_1.Box>
          </core_1.Box>
        </core_1.Box>
        <create_account_plus_logos_1.default transparent={false}/>
      </layout_1.default>);
    };
    return Features;
}(React.Component));
// export default Features;
exports.default = styles_1.withStyles(styles)(gatsby_plugin_breakpoints_1.withBreakpoints(Features));
