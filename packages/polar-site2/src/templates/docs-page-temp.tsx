import React from "react";
import { graphql, PageProps } from "gatsby";
import { LayoutDocs } from "../components/layout";
import SEO from "../components/seo";
import Docsindex from "../components/docs-index/docs-index";
import { Container, Box, CssBaseline } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { useBreakpoint } from "gatsby-plugin-breakpoints";
import Footer from "../components/footer";
import theme from "../gatsby-theme-material-ui-top-layout/docsTheme";

type Node = {
  map: Function;
  frontmatter: {
    title: string;
    date: string;
    permalink: string;
  };
  fields: {
    slug: string;
  };
  html: string;
};

type Data = {
  site: {
    siteMetadata: {
      title: string;
    };
  };
  markdownRemark: Node;
  allMarkdownRemark: {
    edges: Node[];
  };
};

type pageContext = { slug: string };

const useStyles = makeStyles((theme) => ({
  flexContainer: {
    display: "flex",
    width: "100%",
    margin: "0 auto",
    maxWidth: "1200px",
    minWidth: "770px",
  },
  flexBox: {
    display: "flex",
    width: "100%",
    margin: "0 auto",
  },
  shiftContent: {
    marginLeft: "60px",
  },
  footer: {
    paddingLeft: "460px",
    backgroundColor: "#C4C4C4",
  },
  footerMobile: {},
}));

const Documentation = ({ data, pageContext }: PageProps<Data, pageContext>) => {
  const post = data.markdownRemark;
  const breakpoints = useBreakpoint();
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LayoutDocs>
        <SEO
          description="POLAR Documentation. Getting started, FAQ, and ways to optimize your Polar process."
          title="Documentation"
          lang="en"
        />

        <Box
          style={{
            minHeight: "100vh",
            backgroundColor: "rgb(38, 38, 38)"
          }}
        >
          <Box style={{ margin: "0 auto" }}>
            {breakpoints.sm ? (
              <DocsMobile data={data} classes={classes} />
            ) : (
              <DocsDesktop data={data} classes={classes} />
            )}
          </Box>
        </Box>

        <Box style={{ position: "relative" }}>
          <Footer />
        </Box>
      </LayoutDocs>
    </ThemeProvider>
  );
};

function DocsDesktop({ data, classes }) {
  const breakpoints = useBreakpoint();

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "space-around",
        margin: "0 auto",
      }}
    >
      <Box className={classes.flexContainer}>
        <Box style={{ height: "100%", width: "30%" }}>
          <Docsindex
            currTitle={data.markdownRemark.frontmatter.title}
            docs={data.allMarkdownRemark.edges}
          />
        </Box>

        <Box
          style={{ flexBasis: "70%" }}
          className={breakpoints.md ? classes.shiftContent : null}
        >
          <Box style={{ }}>
            <div
              dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function DocsMobile({ data, classes }) {
  return (
    <React.Fragment>
      <Docsindex
        currTitle={data.markdownRemark.frontmatter.title}
        docs={data.allMarkdownRemark.edges}
      />

      <Box className={classes.flexBox}>
        <Container
          style={{
            maxWidth: "90vw",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
        </Container>
      </Box>
    </React.Fragment>
  );
}

export default Documentation;

export const pageQuery = graphql`
  query DocBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        permalink
      }
      headings {
        value
        depth
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { layout: { eq: "doc" } } }
      sort: { fields: fields___placement, order: ASC }
    ) {
      edges {
        node {
          fields {
            slug
            placement
            indent
          }
          headings {
            depth
            value
          }
          html
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
            permalink
          }
        }
      }
    }
  }
`;
