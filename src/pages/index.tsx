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


          <div className={classes.centerSection + ' ' + classes.newHeroSection}>

              <h1 style={{fontSize: '100px', lineHeight: '1em', fontWeight: 500}}>
                  Read. Learn. Never Forget.
              </h1>

              <h2>
                  Effortlessly annotate, highlight, and track your reading progress.
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


          <div className={classes.centerSection}>

              <h1>
                  Organize your reading
              </h1>

              <h2>
                  Document repository for PDFs, EPUBs, and webpages.
              </h2>

              {/*<h3>*/}
              {/*    Read and manage multiple documents at the same time.*/}
              {/*</h3>*/}

              <AnnotationRepositoryImage className={classes.centerImage}
                                         alt="Polar App homepage screenshot macbook"/>
          </div>



          <div className={classes.centerSection}>

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





          <div className={breakpoints.md ? classes.evenPageFrameMobile : classes.evenPageFrame}>
          <Box className={breakpoints.md ? classes.pageContentMobile : classes.evenPageContent}>
            <Box className={breakpoints.md ? classes.evenPageText : classes.hidden}>
              {/* <Fade up> */}
              <h1 className={breakpoints.md ? classes.headerMobile : null}>
                Connect your thoughts
              </h1>

              <p
                className={
                  breakpoints.md ? classes.subtitleMobile : classes.hidden
                }
              >
                Build a networked knowledge base.
              </p>

              <p className={breakpoints.md ? classes.hidden : null}>
                Build a networked knowledge base. <br />
                Crosslink annotations and comments across your reading.{" "}
              </p>
              {/* </Fade> */}
            </Box>
            {/* <Fade left> */}

            <img
              // style={{ objectFit: "contain",  }}
              className={
                breakpoints.md ? classes.imgMobileDimen : classes.imgDimenEven
              }
              src={ImgPoppAnnotsMac}
              alt="Polar App notes and annotations screenshot macbook mockup"
            />
            {/* </Fade> */}
            <p
              className={
                breakpoints.md ? classes.subtitleMobileBottom : classes.hidden
              }
            >
              Crosslink annotations and comments across your reading.
            </p>
            <Box className={classes.evenPageText}>
              {/* <Fade up> */}
              <h1 className={breakpoints.md ? classes.hidden : null}>
                Connect your thoughts
              </h1>

              <p className={breakpoints.md ? classes.hidden : null}>
                Build a networked knowledge base. <br />
                Crosslink annotations and comments across your reading.{" "}
              </p>
              {/* </Fade> */}
            </Box>
          </Box>
        </div>
        <div
          className={
            breakpoints.md ? classes.oddPageFrameMobile : classes.oddPageFrame
          }
        >
          <Box
            className={
              breakpoints.md ? classes.pageContentMobile : classes.pageContent
            }
          >
            <Box
              className={
                breakpoints.md ? classes.pageTextMobile : classes.pageText
              }
            >
              {/* <Fade up> */}
              <h1 className={breakpoints.md ? classes.headerMobile : null}>
                Read actively
              </h1>
              <p className={breakpoints.md ? classes.hidden : null}>
                Annotations and comments, active reading, <br /> incremental
                reading, and flashcards
              </p>
              <p
                style={{
                  maxWidth: "60%",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                className={
                  breakpoints.md ? classes.subtitleMobile : classes.hidden
                }
              >
                Annotations and comments, active reading, <br /> incremental
                reading, and flashcards
              </p>
              {/* </Fade> */}
            </Box>
            {/* <Fade left> */}
            <img
              className={breakpoints.md ? classes.hidden : classes.imgDimen}
              src={ImgReadDocs}
              alt="Polar App pdf reader screenshot macbook mockup"
            />

            <img
              className={
                breakpoints.md ? classes.imgMobileDimen : classes.hidden
              }
              alt="Polar App pdf reader screenshot macbook mockup"
              src={ImgReadDocs}
            />
            {/* </Fade> */}
          </Box>
        </div>

        <CreateAccountWLogos transparent={false} />
      </Box>
    </Layout>
  );
};

export default Landing;
