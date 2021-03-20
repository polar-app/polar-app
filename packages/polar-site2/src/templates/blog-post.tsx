import * as React from "react";
import { PageProps, Link, graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo_post";
import { Typography, Container, ThemeProvider } from "@material-ui/core";
import { Box, CssBaseline } from "@material-ui/core";
import theme from "../gatsby-theme-material-ui-top-layout/docsTheme";
import {CreateAccountButton} from "../components/CreateAccountButton";
import { makeStyles } from "@material-ui/styles";
import { ArrowBack, ArrowForward } from "@material-ui/icons";

type Node = {
  frontmatter: {
    title: string;
    date: string;
    large_image: string;
    description: string;
  };
  excerpt: string;
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
};

type pageContext = {
  previous: Node;
  next: Node;
};

const useStyles = makeStyles({
  blogContent: {
    "& h1": {
      fontSize: "46px",
      lineHeight: "69px",
    },
    "& h2": {
      fontSize: "30px",
      margin: "50px 0",
      lineHeight: "normal",
    },
    "& iframe": {
      maxWidth: "100%",
    }
  },
  navLink: {
      display: "flex",
      alignItems: "center",
      color: "white",
      textDecoration: "none",
      "&:hover, &:active": {
          textDecoration: "underline",
      }
  }
});

const BlogPostTemplate = ({data, pageContext,}: PageProps<Data, pageContext>) => {
  const post = data.markdownRemark;
  const classes = useStyles();

  const { previous, next } = pageContext;

  const date = data.markdownRemark.frontmatter.date;

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Layout>
          <CssBaseline />

          <SEO title={data.markdownRemark.frontmatter.title}
               description={post.frontmatter.description || post.excerpt}
               image={post.frontmatter.large_image}
               lang="en"/>

          <Container style={{
                         maxWidth: "1000px",
                         marginLeft: `auto`,
                         marginRight: `auto`,
                         marginTop: '2rem'
                     }}>

            <section className={ classes.blogContent } dangerouslySetInnerHTML={{ __html: post.html }} />

            <i style={{ display: "block", margin: "20px 0" }}>Posted on: {date}</i>
            <Bio />
            <nav>
              <ul
                style={{
                  display: `flex`,
                  // flexWrap: `wrap`,
                  justifyContent: `space-between`,
                  listStyle: `none`,
                  padding: 0,
                }}
              >
                <Typography variant="button">
                  <li>
                    {previous && (
                      <Link className={classes.navLink} to={previous.fields.slug} rel="prev">
                        <ArrowBack style={{ marginRight: "10px" }} /> PREV
                      </Link>
                    )}
                  </li>
                </Typography>
                <Typography variant="button">
                  <li>
                    {next && (
                      <Link className={classes.navLink} to={next.fields.slug} rel="next">
                        {/* {next.frontmatter.title} → */}
                        Next <ArrowForward style={{ marginLeft: "10px" }} />
                      </Link>
                    )}
                  </li>
                </Typography>
              </ul>
            </nav>
            <footer>
                <hr/>
                <div style={{
                         textAlign: 'center',
                         marginTop: '50px',
                         marginBottom: '50px'
                     }}>
                    <h1>
                        Organize your reading. Read to Remember.
                    </h1>
                    <CreateAccountButton/>
                </div>
            </footer>
          </Container>
        </Layout>
      </Box>
    </ThemeProvider>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      excerpt(pruneLength: 160)
      frontmatter {
        title
        date(formatString: "MMM DD, YYYY")
        large_image
      }
      fields {
        slug
      }
    }
  }
`;
