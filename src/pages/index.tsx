import React from "react";
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
const twitterImage = require("../../content/assets/polar-pic.jpg");

const useStyles = IndexStyling;

const Landing = ({ location }) => {
  const breakpoints = useBreakpoint();
  const classes = useStyles();

  // "gatsby-remark-images": "^3.3.8",
  // "gatsby-remark-prismjs": "^3.5.2",
  // "gatsby-remark-responsive-iframe": "^2.4.3",
  // "gatsby-remark-smartypants": "^2.3.2",
  // "gatsby-plugin-feed": "^2.5.3",
  // // "gatsby-plugin-offline": "^3.2.7",
  // "gatsby-plugin-sharp": "^2.6.9",
  //   "gatsby-plugin-typography": "^2.5.2",
  //   "gatsby-remark-copy-linked-files": "^2.3.3",
  // "gatsby-transformer-sharp": "^2.5.3",
  // "global": "^4.4.0",
  // "prismjs": "^1.20.0",
  // // "react-custom-scrollbars": "^4.2.1",
  // "typeface-merriweather": "0.0.72",
  // "typeface-montserrat": "0.0.75",
  // "typography": "^0.16.19"
  // "gatsby-image": "^2.4.5",

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

          <AnnotationRepositoryImage/>

        <div
          className={
            breakpoints.md ? classes.topPageFrameMobile : classes.topPageFrame
          }
        >
          <Box
            className={
              breakpoints.md ? classes.topContentMobile : classes.topContent
            }
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center",
                margin: "0px",
                left: "0",
              }}
            >
              {/* <Fade style={{ marginRight: 0 }} up> */}
              <h1
                className={
                  breakpoints.md ? classes.headerMobile : classes.headerDesk
                }
              >
                Read. Learn.
                Never Forget.
              </h1>

              <p className={breakpoints.md ? classes.subtitleMobile : null}>
                Effortlessly annotate, highlight, and track your reading
                progress.
              </p>
              {/* </Fade> */}
              <img style={{
                       maxWidth: "90vw",
                       margin: "0 auto",
                   }}
                   className={
                       breakpoints.md ? classes.imgMobileDimen : classes.hidden
                   }
                   src={ImgDocAnnotationsMac}
                  alt="Polar App annotations and notes screenshot macbook"
              />
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Button
                  className={
                    breakpoints.sm ? classes.buttonAccMobile : classes.buttonAcc
                  }
                >
                  Create Account
                </Button>
                <div>
                  Already using Polar?{" "}
                  <a style={{ color: "#A88CFF" }} href="#">
                    Sign in
                  </a>
                </div>
              </Box>
            </Box>

            <img
              style={{
                marginRight: "20%",
              }}
              className={breakpoints.md ? classes.hidden : classes.imgDimen}
              src={ImgDocAnnotationsMac}
              alt="Polar App annotations and notes screenshot macbook mockup"
            />
          </Box>
          <TrustedByLogos />
        </div>

        <div className={breakpoints.md ? classes.oddPageFrameMobile : classes.oddPageFrame}>
          <Box className={breakpoints.md ? classes.pageContentMobile : classes.pageContent}>
            <Box className={breakpoints.md ? classes.pageTextMobile : classes.pageText}
                 style={{ width: "56%" }}>
              {/* <Fade up> */}
              <h1 className={breakpoints.md ? classes.headerMobile : null}>
                Organize your reading
              </h1>
              <p className={breakpoints.md ? classes.hidden : null}>
                Document repository for PDFs, epubs, and webpages. <br />
                Read and manage multiple documents at the same time.
              </p>

              <p className={breakpoints.md ? classes.subtitleMobile : classes.hidden}>
                Read and manage multiple documents at the same time.
              </p>
              {/* </Fade> */}
            </Box>
            {/* <Fade left> */}
            {breakpoints.md ? (
              <img
                className={classes.imgMobileDimen}
                src={ImgPoppFeatsMac}
                alt="Polar App homepage screenshot macbook"
              />
            ) : (
              <img
                className={classes.imgDimen}
                src={ImgPoppFeatsMac}
                alt="Polar App homepage screenshot macbook"
              />
            )}
            {/* </Fade> */}
            <p
              className={
                breakpoints.md ? classes.subtitleMobileBottom : classes.hidden
              }
            >
              Document repository for PDFs, epubs, and webpages.
            </p>
          </Box>

          {/* </Container> */}
          {/* </Box> */}
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

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
