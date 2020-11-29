"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var layout_1 = require("../components/layout");
var seo_1 = require("../components/seo");
var core_1 = require("@material-ui/core");
var gatsby_plugin_breakpoints_1 = require("gatsby-plugin-breakpoints");
var create_account_plus_logos_1 = require("../components/create-account-plus-logos");
var indexStyling_1 = require("../gatsby-theme-material-ui-top-layout/indexStyling");
var trusted_by_logos_1 = require("../components/trusted-by-logos");
var AnnotationRepositoryImage_1 = require("./images/AnnotationRepositoryImage");
var DocumentRepositoryImage_1 = require("./images/DocumentRepositoryImage");
var DocumentViewerImage_1 = require("./images/DocumentViewerImage");
var StatisticsImage_1 = require("./images/StatisticsImage");
var FlashcardReviewImage_1 = require("./images/FlashcardReviewImage");
var CreateAccountButton_1 = require("../components/CreateAccountButton");
var SummaryLargeImage = require("../../content/assets/screenshots/summary-large-image.png");
var useStyles = indexStyling_1.default;
var Landing = function (_a) {
    var breakpoints = gatsby_plugin_breakpoints_1.useBreakpoint();
    var classes = useStyles();
    return (<layout_1.default>
      <seo_1.default title="POLAR - Read. Learn. Never Forget." description="POLAR - Read. Learn. Never Forget. Polar is a reading tool for networked knowledge. Use it to effortlessly annotate, highlight, and track your reading progress." lang="en" card="summary_large_image" image={SummaryLargeImage}/>

      <core_1.Box style={{
        flexDirection: "column",
        overflow: "hidden",
    }} className={breakpoints.md ? classes.marginsMobile : null}>


          <div className={classes.newHeroSection + ' ' + classes.centerSection}>

              <h1 style={{
        fontSize: '100px',
        lineHeight: '1em',
        fontWeight: 500,
        marginTop: '45px',
        marginBottom: '45px'
    }}>
                  Read. Learn. Never Forget.
              </h1>

              <h2 style={{
        maxWidth: '1200px',
        textAlign: 'center',
        marginBottom: '20px'
    }}>
                  Polar is an integrated reading environment to build your knowledge base. Actively read,
                  annotate, connect thoughts, create flashcards, and track progress.
              </h2>

              <div style={{
        marginLeft: 'auto',
        marginRight: 'auto'
    }}>

                  <CreateAccountButton_1.CreateAccountButton />

              </div>

              <div style={{ marginBottom: '10px' }}>
                  Already using Polar?{" "}
                  <a style={{ color: "#A88CFF" }} href="https://app.getpolarized.io">
                      Sign in
                  </a>
              </div>

              
              
              

              <DocumentRepositoryImage_1.default className={classes.centerImage}/>

              <trusted_by_logos_1.default />

          </div>


          <div className={classes.centerSection + ' ' + classes.sectionEven}>

              <h1>
                  Organize and Prioritize Your Reading
              </h1>

              <h2>
                  Upload PDFs and EPUBs, capture web pages with the Polar Chrome extension. Keep all your documents in one place. Manage and prioritize your reading with progress tracking, flagging, tagging, and more

              </h2>

              
              
              

              <AnnotationRepositoryImage_1.default className={classes.centerImage} alt="Polar App homepage screenshot macbook"/>
          </div>


          <div className={classes.centerSection + ' ' + classes.sectionOdd}>

              <h1>
                  Active Reading
              </h1>

              <h2>
                  Use Polar's integrated document viewer for active and incremental reading. Annotate, highlight text and areas, tag annotations, comment, use advanced pagemarks, and create flashcards from highlights.
              </h2>

              <DocumentViewerImage_1.default className={classes.centerImage} alt="Polar Document Viewer"/>
          </div>






          <div className={classes.centerSection + ' ' + classes.sectionEven}>

              <h1>
                  Flashcards and Anki Integration
              </h1>

              <h3>
                  Create flashcards in one click from your annotations and highlights. Review them using
                  spaced repetition algorithm or sync them with Anki.
              </h3>

              <FlashcardReviewImage_1.default className={classes.centerImage} alt="Polar Reading Statistics"/>
          </div>


          <div className={classes.centerSection + ' ' + classes.sectionOdd}>

              <h1>
                  Keep Track of Reading Statistics
              </h1>

              <h2>
                  Commit to reading a fixed number of pages per day and use it to encourage your reading.
              </h2>

              <StatisticsImage_1.default className={classes.centerImage} alt="Polar Reading Statistics"/>
          </div>

          <create_account_plus_logos_1.default transparent={false}/>

      </core_1.Box>
    </layout_1.default>);
};
exports.default = Landing;
