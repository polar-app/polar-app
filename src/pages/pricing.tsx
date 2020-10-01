import * as React from "react"
import { graphql, Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { Box, makeStyles } from "@material-ui/core";

import { PricingTable } from "../components/pricing-table-desk";

import { useBreakpoint } from "gatsby-plugin-breakpoints";

const useStyles = makeStyles({
  checkCircle: {
    maxHeight: "24px",
  },

  header: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "20px",
    lineHeight: "33px",
  },

  background: {
    display: "flex",
    flexDirection: "column",
    background: `radial-gradient(
        farthest-corner at 0% 100%,
        rgba(255, 255, 255, 0.4),
        #424242
      )`,
    mixBlendMode: "normal",
    opacity: 0.85,
    overflowX: "hidden",
    // maxWidth: "100vw",
    // transform: "rotate(-180deg)",
  },

  tableDesktop: {
    background: "#4F4F4F",
    mixBlendMode: "normal",
    boxShadow: "0px 4px 4px #4F4F4F",
    width: "100%",
    textAlign: "center",
    borderCollapse: "collapse",
    display: "block",
  },

  imgBox: {
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
  },

  buttonSignUp: {
    textTransform: "none",
    marginTop: "5vh",
    marginBottom: "8px",
    backgroundColor: "#6754D6",
    // width: "17vw",
    // height: "90vh",
    width: "180px",
    height: "45px",
  },

  rowHead: {
    textAlign: "right",
    // width: "200px",
    padding: "14px",
  },

  divider: {
    marginLeft: "4%",
    width: "92%",
    // textAlign: "center",
  },

  // tr: {
  //   border: " 0.2px solid #FFFFFF",
  // },

  row: {
    // borderBottom: "0.2px solid #FFFFFF",
    height: "54px",
    width: "65%",
  },

  h2: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "24px",
    // lineHeight: "33px",
    lineHeight: "28px",
    /* identical to box height */

    textAlign: "center",
    letterSpacing: "0.50px",
  },

  h3: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    lineHeight: "33px",
    /* identical to box height */

    textAlign: "center",
    letterSpacing: "0.50px",
  },

  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "0",
    padding: "0",
  },

  highlightText: {
    color: "#988AEA",
  },

  h3Spacer: {
    lineHeight: "33px",
    /* identical to box height */

    textAlign: "center",
    fontSize: "40px",
    padding: "0 5%",
  },

  hidden: {
    display: "none !important",
  },

  h2Mobile: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "20px",
    lineHeight: "21px",
    /* identical to box height */

    // textAlign: "center",
    letterSpacing: "0.15px",
  },

  h3Mobile: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "18px",
    /* identical to box height */

    // textAlign: "center",
    letterSpacing: "0.15px",
  },
});

const Landing = ({ location }) => {
  const classes = useStyles();
  const breakpoints = useBreakpoint();

  return (
    <Layout>
      <SEO
        description="An outline of all Polar pricing options. Polar has a flexible array of pricing options to suit any user's needs."
        title="Pricing Plans"
        lang="en"
      />

      <Box className={classes.background}>
        {/* <Container
            maxWidth="xl"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          > */}
        <h1 style={{ width: "100vw", textAlign: "center", marginTop: "3%" }}>
          Pricing
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: `auto`,
            marginRight: `auto`,
            flexGrow: 1,
            width: "100%",
            maxWidth: "1550px",
            // height: "100vh",
          }}
          className={breakpoints.md ? classes.hidden : null}
        >
          <h2
            style={{ marginTop: "60px", marginBottom: "0px" }}
            className={classes.h2}
          >
            All <span className={classes.highlightText}>existing users </span>
            will be
            <span className={classes.highlightText}> grandfathered</span>. Learn
            more{" "}
            <a
              href="https://www.reddit.com/r/PolarBookshelf/comments/ho6xjs/polar_20_pricing_update_and_grandfathering/"
              style={{ color: "#FFFFFF", textDecoration: "underline" }}
              target="__blank"
            >
              here
            </a>
            .{/* <br /> */}
          </h2>
          <h2 style={{ marginTop: "4%" }} className={classes.h2}>
            For enterprise, contact us directly{" "}
            <a
              href="mailto:jonathan@getpolarized.io"
              style={{ color: "#FFFFFF", textDecoration: "underline" }}
            >
              here
            </a>
          </h2>
          {/* <h2 className={classes.h2}>
            
          </h2> */}
          <Box
            style={{ marginTop: "4%", width: "40%", paddingBottom: "15px" }}
            className={classes.flexContainer}
          >
            <div className={classes.h3}>50% student discount for any plan</div>
            <div className={classes.h3Spacer}>&#183;</div>
            <div className={classes.h3}>Start with a 14-day free trial</div>
          </Box>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: `auto`,
            marginRight: `auto`,
            flexGrow: 1,
            width: "100%",
            // height: "100vh",
          }}
          className={breakpoints.md ? null : classes.hidden}
        >
          <Box style={{ margin: "40px 0" }} className={classes.h2Mobile}>
            Start with a{" "}
            <span className={classes.highlightText}> 14-day free trial</span>
          </Box>
          <Box
            style={{ marginTop: 0, marginBottom: "20px" }}
            className={classes.h3Mobile}
          >
            {" "}
            <span className={classes.highlightText}>
              50% student discount for any plan. {breakpoints.sm && <br />}
            </span>{" "}
            Existing users will be{" "}
            <span className={classes.highlightText}>grandfathered</span>
          </Box>
        </div>

        {/* </Container> */}

        <PricingTable />
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
