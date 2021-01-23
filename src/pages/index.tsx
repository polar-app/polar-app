import * as React from "react"
import Layout from "../components/layout";
import SEO from "../components/seo";
import {Box} from "@material-ui/core";
import {useBreakpoint} from "gatsby-plugin-breakpoints";
import CreateAccountWLogos from "../components/create-account-plus-logos";
import IndexStyling from "../gatsby-theme-material-ui-top-layout/indexStyling";
import TrustedByLogos from "../components/trusted-by-logos";
import AnnotationRepositoryImage from "./images/AnnotationRepositoryImage";
import DocumentRepositoryImage from "./images/DocumentRepositoryImage";
import DocumentViewerImage from "./images/DocumentViewerImage";
import StatisticsImage from "./images/StatisticsImage";
import FlashcardReviewImage from "./images/FlashcardReviewImage";
import {CreateAccountButton} from "../components/CreateAccountButton";
const SummaryLargeImage = require("../../content/assets/screenshots/summary-large-image.png");

const useStyles = IndexStyling;

const Landing = ({}) => {
  const breakpoints = useBreakpoint();
  const classes = useStyles();

  return (
    <Layout>
      <SEO
        title="POLAR - Read. Learn. Never Forget."
        description="POLAR - Read. Learn. Never Forget. Polar is a reading tool for networked knowledge. Use it to effortlessly annotate, highlight, and track your reading progress."
        lang="en"
        card="summary_large_image"
        image={SummaryLargeImage}/>

      <Box style={{
               flexDirection: "column",
               overflow: "hidden",
           }}
           className={breakpoints.md ? classes.marginsMobile : null}>


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

                  <CreateAccountButton/>


              </div>

              <div style={{marginBottom: '10px'}}>
                  Already using Polar?{" "}
                  <a style={{ color: "#A88CFF" }} href="https://app.getpolarized.io/sign-in">
                      Sign in
                  </a>
              </div>

              {/*<h3>*/}
              {/*    Read and manage multiple documents at the same time.*/}
              {/*</h3>*/}

              <DocumentRepositoryImage className={classes.centerImage}/>

              <TrustedByLogos />

          </div>


          <div className={classes.centerSection + ' ' + classes.sectionEven}>

              <h1>
                  Organize and Prioritize Your Reading
              </h1>

              <h2>
                  Upload PDFs and EPUBs, capture web pages with the Polar Chrome extension. Keep all your documents in one place. Manage and prioritize your reading with progress tracking, flagging, tagging, and more

              </h2>

              {/*<h3>*/}
              {/*    Read and manage multiple documents at the same time.*/}
              {/*</h3>*/}

              <AnnotationRepositoryImage className={classes.centerImage}
                                         alt="Polar App homepage screenshot macbook"/>
          </div>


          <div className={classes.centerSection + ' ' + classes.sectionOdd}>

              <h1>
                  Active Reading
              </h1>

              <h2>
                  Use Polar's integrated document viewer for active and incremental reading. Annotate, highlight text and areas, tag annotations, comment, use advanced pagemarks, and create flashcards from highlights.
              </h2>

              <DocumentViewerImage className={classes.centerImage}
                                         alt="Polar Document Viewer"/>
          </div>






          <div className={classes.centerSection + ' ' + classes.sectionEven}>

              <h1>
                  Flashcards and Anki Integration
              </h1>

              <h3>
                  Create flashcards in one click from your annotations and highlights. Review them using
                  spaced repetition algorithm or sync them with Anki.
              </h3>

              <FlashcardReviewImage className={classes.centerImage}
                                    alt="Polar Reading Statistics"/>
          </div>


          <div className={classes.centerSection + ' ' + classes.sectionOdd}>

              <h1>
                  Keep Track of Reading Statistics
              </h1>

              <h2>
                  Commit to reading a fixed number of pages per day and use it to encourage your reading.
              </h2>

              <StatisticsImage className={classes.centerImage}
                               alt="Polar Reading Statistics"/>
          </div>

          <CreateAccountWLogos transparent={false} />

      </Box>
    </Layout>
  );
};

export default Landing;
