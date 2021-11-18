import * as React from "react"
import { Box, Container } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
// import EditorsChoice from "./BlogAside";
import { Link } from "gatsby-material-ui-components";
const DEFAULT_POST_IMAGE = require("../../content/assets/utility-images/defaultBlogPost.jpg");
const DEFAULT_POST_IMAGE1 = require("../../content/assets/utility-images/defaultBlogPost1.jpg");
const ImgPolarLogo = require("../../content/assets/polar-icon.png");

import Bio from "./bio";

import { StaticQuery, graphql } from "gatsby";
import { useBreakpoint } from "gatsby-plugin-breakpoints";

const useStyles = makeStyles({
  articleCard: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#606060",
    // margin: "40px 14px",
    transform: "scale(1)",
    transition: "box-shadow .2s, border .2s",
    borderRadius: "6px",
    overflow: "hidden",
    // "&:hover": {
    //   boxShadow: " 4px 2px 40px 3px #424242",
    //
    //   transform: "scale(1.01)",
    //   borderBottom: "10px solid #816DE8",
    // },
    // maxHeight: "500px",
  },

  articleInfo: {
    // display: "flex",
    // flexDirection: "column",
    backgroundColor: "#606060",
    width: "100%",
    flexGrow: 3,
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    // alignSelf: "left",
    // height: "50%",
    // height: "50%",
    // position: "absolute",
    // bottom: "0",
    // minHeight: "200px",
  },

  gridContainer: {
    display: "grid",
    gap: "30px",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    "& > :first-child": {
      gridColumn: "1 / span 2"
    }
  },

  articleHeading: {
    margin: "12px 0 0 0",
    "&:hover": {
      textDecoration: "underline",
    }
  },
  articleDate: {
    margin: "26px 0 0 0",
    fontSize: "14px",
  },

  singleColCard: {
    flexBasis: "30%",
    margin: "12px 0px",
  },
  doubleColCard: {
    flexBasis: "63%",
    margin: "12px 0px",
  },

  tripleColCard: {

    flexBasis: "97%",
    margin: "12px 0px",
  },
  title: {
    fontSize: "28px",
    lineHeight: '1.3em'
  },

  titleMobile: {
    fontSize: "24px",
    lineHeight: '1.3em'
  },
  articleBlob: {
    transition: "box-shadow .2s, border .2s",
    padding: "0 3%",

    borderRadius: "4px",
    // "&:hover": {
    //   boxShadow: " 4px 2px 40px 3px #424242",
    //
    //   // transform: "scale(1.01)",
    //   borderBottom: "10px solid #816DE8",
    // },

    // backgroundColor: "#606060",
  },
  excerpt: {
    marginLeft: "5%",
    borderLeft: "3px solid #816DE8",
    marginBottom: "5%",

    // "&:hover": { borderLeft: "5px solid #816DE8" },
  },
});

function BlogHeadMobile({ posts }) {
  const breakpoints = useBreakpoint();
  const classes = useStyles();
  // console.log("small" + breakpoints.xs);
  var colLayoutPicker = -1;
  const numCols = [
    classes.singleColCard,
    classes.singleColCard,
    classes.singleColCard,
    classes.singleColCard,
    classes.doubleColCard,
  ];
  function defaultPostImage(num) {
    // console.log("-----------" + (num % 2));
    if (num % 2 === 0) {
      return DEFAULT_POST_IMAGE;
    } else {
      return DEFAULT_POST_IMAGE1;
    }
  }
  return (
    <React.Fragment>
      <Box
        style={{
          display: "flex",
          maxWidth: "400px",
          paddingLeft: "22px",
          margin: "30px 0px 30px 0px",
        }}
      >
        <img
          style={{
            maxWidth: "69px",
            maxHeight: "69px",

            borderRadius: "50%",
            // marginLeft: "0px",
            // marginRight: "4px",
          }}
          src={ImgPolarLogo}
        />
        <h1 style={{ margin: "auto 10px" }}>Polar Blog</h1>
      </Box>
      <Box
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug;
          const date = node.frontmatter.date;
          const image = node.frontmatter.large_image;
          const noImage = image === null;

          return (
            <Box className={classes.articleBlob} key={title}>

              <a style={{ textDecoration: "none", color: "#e0e0e0" }}
                 href={node.fields.slug}>

                <Container style={{ textOverflow: "wrap", maxWidth: "1000px" }}
                           disableGutters
                           key={node.fields.slug}>

                  <h4 style={{ marginBottom: "0" }}>
                    {title}
                  </h4>
                  <p style={{ paddingBottom: "5px" }}>{date}</p>
                  {!noImage && (
                    // <Container disableGutters>
                    <img src={image} />
                    // </Container>
                  )}
                  <div
                    className={classes.excerpt}
                    // style={{
                    //   marginLeft: "5%",
                    //   borderLeft: "3px solid #816DE8",
                    //   marginBottom: "5%",
                    // }}
                  >
                    <p
                      style={{ maxWidth: "720px", marginLeft: "5%" }}
                      dangerouslySetInnerHTML={{
                        __html: node.excerpt,
                      }}
                    />
                  </div>
                </Container>
              </a>
            </Box>
          );
        })}
      </Box>

      {breakpoints.sm ||
        (breakpoints.xs && <hr style={{ margin: "80px 0 80px 0" }} />)}
    </React.Fragment>
  );
}

function BlogHeadDesktop({ posts }) {
  const breakpoints = useBreakpoint();
  const classes = useStyles();
  function defaultPostImage(num) {
    // console.log("-----------" + (num % 2));
    if (num % 2 === 0) {
      return DEFAULT_POST_IMAGE;
    } else {
      return DEFAULT_POST_IMAGE1;
    }
  }
  return (
    <React.Fragment>
      <Box
        style={{
          display: "flex",
          //   maxWidth: "400px",
          paddingLeft: "22px",
          margin: "30px 0px 30px 0px",
        }}
      >
        {/*<img*/}
        {/*  style={{*/}
        {/*    maxWidth: "69px",*/}
        {/*    maxHeight: "69px",*/}

        {/*    borderRadius: "50%",*/}
        {/*    // marginLeft: "0px",*/}
        {/*    // marginRight: "4px",*/}
        {/*  }}*/}
        {/*  src={ImgPolarLogo}*/}
        {/*/>*/}
        {/*<Box style={{ display: "flex", flexDirection: "column" }}>*/}
        {/*  /!*<h1 style={{ margin: "auto 10px" }}>Polar Blog</h1>*!/*/}

        {/*  /!*<p style={{ marginLeft: "10px", marginTop: "0px" }}>*!/*/}
        {/*  /!*  /!*Written by <strong>Polar Team</strong> A place to catch up on all*!/*!/*/}
        {/*  /!*  /!*things productivity... and all things Polar!*!/*!/*/}
        {/*  /!*  {` `}*!/*/}
        {/*  /!*  /!*<a*!/*!/*/}
        {/*  /!*  /!*  style={{ textDecoration: "none" }}*!/*!/*/}
        {/*  /!*  /!*  href={`https://twitter.com/getpolarized`}*!/*!/*/}
        {/*  /!*  /!*>*!/*!/*/}
        {/*  /!*  /!*  You should follow us on Twitter*!/*!/*/}
        {/*  /!*  /!*</a>*!/*!/*/}
        {/*  /!*</p>*!/*/}
        {/*</Box>*/}
      </Box>
      <Box
        className={ classes.gridContainer }
      >
        {posts.map(({ node }, i: number) => {
          const title = node.frontmatter.title || node.fields.slug;
          const date = node.frontmatter.date;
          const image = node.frontmatter.large_image;
          const noImage = image === null;

          return (
            <React.Fragment key={node.fields.slug}>
              <Box>
                <a
                  style={{ textDecoration: "none", color: "#fff" }}
                  href={node.fields.slug}
                >
                  <Box className={classes.articleCard} key={title}>
                    <Box style={{ height: "350px" }}>
                      <img
                        style={{ objectFit: "cover", height: "100%", minWidth: "100%" }}
                        src={
                          noImage
                            ? defaultPostImage(i)
                            : image
                        }
                      />
                    </Box>

                    <Box className={classes.articleInfo}>
                      <h4 className={`${classes.articleHeading} ${breakpoints.tab ? classes.titleMobile : classes.title}`}>
                        {title}
                      </h4>
                      <p className={classes.articleDate}>
                        {date}
                      </p>
                    </Box>
                  </Box>
                </a>
              </Box>
              {/*{colLayoutPicker === 0 && (*/}
              {/*  // <Box className={classes.singleColCard}>*/}
              {/*  //   {" "}*/}
              {/*  //   /!*<EditorsChoice />*!/*/}
              {/*  // </Box>*/}
              {/*)}*/}
            </React.Fragment>
          );
        })}
      </Box>

      <hr style={{ margin: "80px 0 50px 0" }} />
    </React.Fragment>
  );
}

export default function BlogHead({ posts }) {
  const breakpoints = useBreakpoint();

  return (
    <React.Fragment>
      {breakpoints.sm ? (
        <BlogHeadMobile posts={posts} />
      ) : (
        <BlogHeadDesktop posts={posts} />
      )}
    </React.Fragment>
  );
}
