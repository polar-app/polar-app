import * as React from "react"
import Layout from "../components/layout";
import SEO from "../components/seo";
import {Box} from "@material-ui/core";
import {useBreakpoint} from "gatsby-plugin-breakpoints";
import CreateAccountWLogos from "../components/create-account-plus-logos";
import IndexStyling from "../gatsby-theme-material-ui-top-layout/indexStyling";
import TrustedByLogos from "../components/trusted-by-logos";
import {CreateAccountButton} from "../components/CreateAccountButton";
import {ColorBackground0, ColorBackground1, ColorBackground2, ColorBackground3} from "../components/ColorBackground";
import KnowledgeAndBrainOrganizedImage from "./images/KnowledgeAndBrainOrganizedImage";
import ReadingOnSteroidsImage from "./images/ReadingOnSteroidsImage";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import HeroImage from "./images/HeroImage";
import DarkModeDark from "./images/DarkModeDark";
import DarkModeLight from "./images/DarkModeLight";
import {FlashcardVideo} from "../components/FlashcardVideo";
import {AnkiSyncVideo} from "../components/AnkiSyncVideo";
import ReadingProgressImage from "./images/ReadingProgressImage";
import WebCaptureImage from "./images/WebCaptureImage";
const SummaryLargeImage = require("../../content/assets/screenshots/summary-large-image.png");

const useStyles = IndexStyling;

const theme = createMuiTheme({
    typography: {
        htmlFontSize: 12,
        fontSize: 12
    },
    palette: {
        type: 'dark',
        primary: {
            'main': 'rgb(103, 84, 214)'
        },
        background: {
            'default': '#1C1C1C',
        },
        // divider: '#303236',
        // text: {
        //     primary: 'rgb(247, 248, 248)'
        // }
    }
});

const Landing = ({}) => {

  const breakpoints = useBreakpoint();
  const classes = useStyles();

  return (
      <ThemeProvider theme={theme}>

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

                  <ColorBackground0 style={{
                                       marginTop: '50px',
                                       marginBottom: '50px'
                                   }}>
                      <HeroImage className={classes.centerImage}/>
                  </ColorBackground0>


                  <TrustedByLogos />

              </div>

              <div className={classes.centerSection + ' ' + classes.sectionEven}>

                  <h1>
                      Your Knowledge and <span style={{color: '#D7AC75'}}>Brain - Organized</span>
                  </h1>

                  <h2>
                      Manage and save for later all your PDFs, EPUBs, and web pages
                      in one place. Use tags, reading progress, and detailed
                      document information to stay on top of your reading.
                  </h2>

                  {/*<h3>*/}
                  {/*    Read and manage multiple documents at the same time.*/}
                  {/*</h3>*/}

                  <ColorBackground1 style={{
                                       marginTop: '50px',
                                       marginBottom: '50px'
                                   }}>
                      <KnowledgeAndBrainOrganizedImage className={classes.centerImage}
                                                       alt="Your Knowledge and Brain Organized"/>
                  </ColorBackground1>
              </div>

              <div className={classes.centerSection + ' ' + classes.sectionEven}>

                  <h1>
                      This is <span style={{color: '#76CDC8'}}>reading on steroids</span>
                  </h1>

                  <h2>
                      Use the integrated reader to actively read, highlight, take
                      notes, connect thoughts, and track progress with pagemarks.
                      Build your detailed knowledge base with granular highlight
                      tagging, and flashcards, directly from text highlights.
                  </h2>

                  {/*<h3>*/}
                  {/*    Read and manage multiple documents at the same time.*/}
                  {/*</h3>*/}

                  <ColorBackground2 style={{
                                       marginTop: '50px',
                                       marginBottom: '50px'
                                   }}>

                      <ReadingOnSteroidsImage className={classes.centerImage}
                                              alt="Reading on Steroids"/>

                  </ColorBackground2>

              </div>


              <div className={classes.centerSection + ' ' + classes.sectionEven}>

                  <h1>
                      <span style={{color: '#ECA091'}}>Web content</span> <br/> captured in one click
                  </h1>

                  <h2>
                      Use the Polar Chrome extension to save web pages in your repository.
                  </h2>

                  <ColorBackground1 style={{
                      marginTop: '50px',
                      marginBottom: '50px'
                  }}>
                      <WebCaptureImage className={classes.centerImage}
                                       alt="Your Knowledge and Brain Organized"/>
                  </ColorBackground1>
              </div>


              <div className={classes.centerSection + ' ' + classes.sectionOdd}>


                  <h1>
                      <span style={{color: '#6BD0AA'}}>Remember forever</span> <br/> what's important.
                  </h1>

                  <h2>
                      Review your annotations and flashcards directly in Polar using our spaced repetition algorithms.
                  </h2>

                  <ColorBackground2 style={{
                                        marginTop: '50px',
                                        marginBottom: '50px'
                                    }}>
                      <FlashcardVideo className={classes.centerImage}/>
                  </ColorBackground2>
              </div>

              <div className={classes.centerSection + ' ' + classes.sectionOdd}>

                  <h1>
                      Sync Your <br/> <span style={{color: '#61BBC6'}}>Flashcards To Anki</span>
                  </h1>

                  <h2>Use your favorite open-source flashcard tool along with
                  Polar. One click and all your Polar flashcards are synced to
                  Anki.</h2>

                  <ColorBackground2 style={{
                      marginTop: '50px',
                      marginBottom: '50px'
                  }}>
                    <AnkiSyncVideo className={classes.centerImage}/>
                  </ColorBackground2>
              </div>


              <div className={classes.centerSection + ' ' + classes.sectionEven}>

                  <h1><span style={{color: '#B4504D'}}>Motivation</span> built-in</h1>

                  <h2>
                      Track your progress automatically.  Commit to a daily
                      number of pages to read or flashcards to review.
                  </h2>

                  <ColorBackground2 style={{
                                        marginTop: '50px',
                                        marginBottom: '50px'
                                    }}>

                      <ReadingProgressImage className={classes.centerImage}
                                             alt="Reading Progress"/>

                  </ColorBackground2>

              </div>

              <div className={classes.centerSection + ' ' + classes.sectionEven}>

                  <h1>
                      <span style={{color: '#7CB3E9'}}>Light</span> or <span style={{color: '#25559F'}}>Dark</span> - you choose
                  </h1>

                  <h2>
                  Look, we get it - some people prefer dark mode, some light
                  mode, We even internally are split on it.  So we build both
                  options for you to choose.
                  </h2>

                  <h2>
                  The PDF is adjusted to your choice - if you choose dark mode,
                  your PDFs automatically	convert to a dark background.
                  </h2>

                  <ColorBackground3 style={{
                                        marginTop: '50px',
                                        marginBottom: '50px',
                                        position: 'relative'
                                    }}>

                      <>

                          <DarkModeDark  className={classes.centerImage}
                                          style={{
                                              visibility: 'hidden',
                                          }}/>

                          <DarkModeDark style={{
                                            width: '80%',
                                            position: 'absolute',
                                            bottom: '5%',
                                            left: '3%',
                                            zIndex: 2,
                                            borderRadius: '10px',
                                            boxShadow: "0px 0px 10px 5px rgb(50,50,50)",
                                        }}/>

                          <DarkModeLight style={{
                                             width: '80%',
                                             position: 'absolute',
                                             bottom: '25%',
                                             left: '17%',
                                             zIndex: 1,
                                             borderRadius: '10px',
                                             boxShadow: "0px 0px 10px 5px rgb(50,50,50)",
                                         }}/>


                      </>

                  </ColorBackground3>


              </div>



              <CreateAccountWLogos transparent={false} />

          </Box>
        </Layout>
      </ThemeProvider>
  );
};

export default Landing;
