import React from "react";
import { PageProps, graphql } from "gatsby";
import Layout from "../components/layout";
import { Container, Box, ThemeProvider } from "@material-ui/core";
import { Link } from "gatsby-material-ui-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../gatsby-theme-material-ui-top-layout/docsTheme";
import { makeStyles } from "@material-ui/styles";
import BlogHead from "../components/BlogHead";
import { ArrowForward, ArrowBack } from "@material-ui/icons";

const NUM_HEADER_CARDS = 6;

type Data = {
  site: {
    siteMetadata: {
      title: string;
    };
  };
  allMarkdownRemark: {
    edges: {
      map: Function;
      slice: Function;
      filter: Function;
      length: number;
      node: {
        frontmatter: {
          title: string;
          date: string;
          large_image: string;
        };
        excerpt: string;
        fields: {
          slug: string;
        };
      };
    };
  };
};
type pageContextType = {
  currentPage: number;
  numBlogPages: number;
};

const useStyles = makeStyles({
  articleCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#606060",

    transform: "scale(1)",
    transition: "box-shadow .2s, border .2s",

    height: "500px",

    borderRadius: "4px",
    // "&:hover": {
    //   boxShadow: " 4px 2px 40px 3px #424242",
    //
    //   transform: "scale(1.01)",
    //   borderBottom: "10px solid #816DE8",
    // },
  },

  articleInfo: {
    backgroundColor: "#606060",
    width: "100%",

    padding: "10px",

    position: "absolute",
    bottom: "0",
  },

  singleColCard: {
    flexBasis: "30%",
    maxHeight: "500px",
    margin: "12px 0px",
  },
  doubleColCard: {
    maxHeight: "500px",

    flexBasis: "63%",
    margin: "12px 0px",
  },

  tripleColCard: {
    maxHeight: "500px",

    flexBasis: "97%",
    margin: "12px 0px",
  },
  articleBlob: {
    transform: "scale(1)",
    transition: "box-shadow .2s, border .2s",
    padding: "35px 40px",

    borderRadius: "4px",
    // "&:hover": {
    //   boxShadow: ` 4px 2px 80px 3px #424242`,
    //
    //   borderBottom: "10px solid #816DE8",
    // },
  },
  articleBlobHeading: {
    margin: 0,
    fontSize: "24px",
    "&:hover": { textDecoration: "underline" },
  },
  excerpt: {
    marginLeft: "5%",
    borderLeft: "3px solid #816DE8",
    marginBottom: "5%",
  },
});

const BlogIndex = ({ data, pageContext }: PageProps<Data, pageContextType>) => {
  const classes = useStyles();
  const posts = data.allMarkdownRemark.edges;
  const { currentPage, numBlogPages } = pageContext;

  var headFilterIndex = 0;
  const isFirst: boolean = currentPage === 1;
  const isLast: boolean = currentPage === numBlogPages;
  const prevPage: string =
    currentPage - 1 === 1 ? "/blog/" : "/blog/" + (currentPage - 1).toString();
  const nextPage: string = "/blog/" + (currentPage + 1).toString();

  function pageNumberGen(index: number): number {
    if (currentPage <= 4) {
      return index + 1;
    }
    if (currentPage === numBlogPages) {
      return currentPage - (numBlogPages - 1) + index;
    }
    if (currentPage + 2 > numBlogPages) {
      return currentPage - (numBlogPages - 2) + index;
    }
    if (currentPage + 3 > numBlogPages) {
      return currentPage - (numBlogPages - 3) + index;
    }

    return currentPage - 2 + index;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          mixBlendMode: "normal",
        }}
      >
        <Layout>
          <CssBaseline />
          {/*<SEO description="The Polar Blog" title="Blog" />*/}

          <Container
            disableGutters
            style={{
              maxWidth: "1200px",
              height: "100%",
              paddingBottom: "5px",
            }}
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: `2%`,
                marginRight: `2%`,
              }}
            >
              {currentPage === 1 && (
                <Box>
                  <BlogHead posts={posts.slice(0, NUM_HEADER_CARDS)} />
                </Box>
              )}
              <Box style={{ margin: "0 3%" }}>
                {posts
                  .filter(function (post) {
                    if (
                      headFilterIndex < NUM_HEADER_CARDS &&
                      currentPage === 1
                    ) {
                      headFilterIndex++;
                      return false;
                    } else {
                      headFilterIndex++;
                      return true;
                    }
                  })
                  .map(({ node }, index) => {
                    const title = node.frontmatter.title || node.fields.slug;
                    const date = node.frontmatter.date;
                    const image = node.frontmatter.large_image;
                    const noImage = image === null;

                    return (
                      <Box className={classes.articleBlob} key={title}>
                        <a
                          style={{ textDecoration: "none", color: "#e0e0e0" }}
                          href={node.fields.slug}
                        >
                          <Container
                            style={{ textOverflow: "wrap", maxWidth: "1000px" }}
                            disableGutters
                            key={node.fields.slug}
                          >
                            <h4
                              className={ classes.articleBlobHeading }
                            >
                              {title}
                            </h4>
                            <p style={{ paddingBottom: "5px" }}>{date}</p>
                            {!noImage && (
                              // <Container disableGutters>
                              <img
                                style={{ maxHeight: "60vh", margin: "0 auto" }}
                                src={image}
                              />
                              // </Container>
                            )}
                            <div className={classes.excerpt}>
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
            </Box>
            <Box style={{ margin: "0 auto", maxWidth: "780px" }}>
              <ul
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                  listStyle: "none",
                  padding: 0,
                  margin: "8% 5% 5% 5%",
                  color: "#FFFFFF",
                }}
              >
                {!isFirst ? (
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      marginRight: "48px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    href={prevPage}
                    rel="prev"
                  >
                    <ArrowBack style={{ marginRight: "8px" }} /> PREV
                  </Link>
                ) : <div style={{ marginRight: "38px" }} />}
                {Array.from({ length: numBlogPages }, (_, i) => (
                  <li
                    key={`pagination-number${i + 1}`}
                    style={{
                      margin: "6px",
                    }}
                  >
                    <Link
                      href={`/blog/${
                        pageNumberGen(i) === 1 ? "" : pageNumberGen(i)
                      }`}
                      style={{
                        background:
                          pageNumberGen(i) === currentPage ? "#6754D6" : "",
                        display: "block",
                        textDecoration: "none",
                        color: "inherit",
                        padding: "10px",
                      }}
                    >
                      {`${pageNumberGen(i)}`}
                    </Link>
                  </li>
                ))}
                {!isLast ? (
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      marginLeft: "48px",
                      display: "flex",
                      alignItems: "center"
                    }}
                    href={nextPage}
                    rel="next"
                  >
                    NEXT <ArrowForward style={{ marginLeft: "8px" }} />
                  </Link>
                ) : <div style={{ marginLeft: "38px" }} />}
              </ul>
            </Box>
          </Container>
        </Layout>
      </Box>
    </ThemeProvider>
  );
};

export default BlogIndex;

// Query for paginated blog
export const pageQuery = graphql`
  query blogQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
      filter: { frontmatter: { layout: { eq: "post" } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 300)
          frontmatter {
            title
            date(formatString: "MMM DD, YYYY")
            large_image
            editorsChoice
          }
          fields {
            slug
          }
        }
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`;
