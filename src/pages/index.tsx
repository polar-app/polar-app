import * as React from "react"
import { graphql } from "gatsby";
import { Button } from "gatsby-material-ui-components";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { Container, Box, makeStyles } from "@material-ui/core";
const ImgDocAnnotationsMac = require("../../content/assets/macbook-screenshots/doc-annotations-macbook.png");
const ImgPoppFeatsMac = require("../../content/assets/macbook-screenshots/feature-macbook.png");
const ImgPoppAnnotsMac = require("../../content/assets/macbook-screenshots/annotations-macbook.png");

const ImgReadDocs = require("../../content/assets/macbook-screenshots/read-docs-macbook.png");
// // import Fade from "react-reveal/Fade";
import { useBreakpoint } from "gatsby-plugin-breakpoints";
import CreateAccountWLogos from "../components/create-account-plus-logos";
import IndexStyling from "../gatsby-theme-material-ui-top-layout/indexStyling";
import TrustedByLogos from "../components/trusted-by-logos";
import GatsbyImage from "../components/GatsbyImage";
import AnnotationRepositoryImage from "./images/AnnotationRepositoryImage";
import DocumentRepositoryImage from "./images/DocumentRepositoryImage";
import DocumentViewerImage from "./images/DocumentViewerImage";
import StatisticsImage from "./images/StatisticsImage";
import FlashcardReviewImage from "./images/FlashcardReviewImage";
const twitterImage = require("../../content/assets/polar-pic.jpg");

const useStyles = IndexStyling;

const Landing = ({ location }) => {
  const breakpoints = useBreakpoint();
  const classes = useStyles();

  return (
    <Layout>
      <SEO
        description="Polar - Read, Learn, Never Forget. Polar is a reading tool for
        networked knowledge. Use it to effortlessly annotate, highlight, and track your reading progress."
        title="Homepage"
        lang="en"
      />

      <Box
        style={{
          flexDirection: "column",
          overflow: "hidden",
        }}
        className={breakpoints.md ? classes.marginsMobile : null}
      >


          <div className={classes.newHeroSection + ' ' + classes.centerSection}>

              <h1 style={{fontSize: '100px', lineHeight: '1em', fontWeight: 500}}>
                  Read. Learn. Never Forget.
              </h1>

              <h2>
                  POLAR makes it effortless to annotate, highlight, and track your reading progress.
              </h2>

              <div style={{
                       marginLeft: 'auto',
                       marginRight: 'auto'
                   }}>

                  <Button className={classes.buttonAccount}>
                      Create Account
                  </Button>

              </div>

              <div>
                  Already using Polar?{" "}
                  <a style={{ color: "#A88CFF" }} href="#">
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
                  Organize Your Reading
              </h1>

              <h2>
                  Document repository for PDFs, EPUBs, and webpages.  Keep all your documents in one place and manage
                  them with tags and folders.
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
                  Annotations and comments, active reading,
                  incremental reading, and flashcards
              </h2>

              <DocumentViewerImage className={classes.centerImage}
                                         alt="Polar Document Viewer"/>
          </div>




          <div className={classes.centerSection}>

              <h1>
                  Keep Track of Reading Statistics
              </h1>

              <h2>
                  Commit to reading a fixed number of pages per day and use it to encourage your reading.
              </h2>

              <StatisticsImage className={classes.centerImage}
                               alt="Polar Reading Statistics"/>
          </div>


          <div className={classes.centerSection}>

              <h1>
                  Flashcards and Integrated Anki Sync
              </h1>

              <h3>
                  Easily create flashcards from your annotations.  Embed images and tags and sync them seamlessly to Anki.
              </h3>

              <FlashcardReviewImage className={classes.centerImage}
                                    alt="Polar Reading Statistics"/>
          </div>




          <CreateAccountWLogos transparent={false} />
      </Box>
    </Layout>
  );
};

export default Landing;
