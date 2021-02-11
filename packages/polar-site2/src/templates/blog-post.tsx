import * as React from "react";
import { PageProps, Link, graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo_post";
import { Typography, Container, ThemeProvider } from "@material-ui/core";
import { Box, CssBaseline } from "@material-ui/core";
import theme from "../gatsby-theme-material-ui-top-layout/docsTheme";
import {CreateAccountButton} from "../components/CreateAccountButton";

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

const BlogPostTemplate = ({data, pageContext,}: PageProps<Data, pageContext>) => {
  const post = data.markdownRemark;

  const { previous, next } = pageContext;

  const date = data.markdownRemark.frontmatter.date;

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          background:
            "conic-gradient(from 223deg at 00% 100%, rgba(255, 255, 255, 0) 0deg, rgba(116, 116, 116, 0.948419) 67.5deg, #313131 212.7deg, rgba(255, 255, 255, 0) 360deg), #424242",
          mixBlendMode: "normal",
        }}
      >
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

            <section dangerouslySetInnerHTML={{ __html: post.html }} />

            <h5>Posted on: {date}</h5>
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
                      <Link to={previous.fields.slug} rel="prev">
                        {/* ← {previous.frontmatter.title} */}← Previous article
                      </Link>
                    )}
                  </li>
                </Typography>
                <Typography variant="button">
                  <li>
                    {next && (
                      <Link to={next.fields.slug} rel="next">
                        {/* {next.frontmatter.title} → */}
                        Next article →
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

                <hr/>

              <Bio />
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
        date(formatString: "YYYY-MM-DD")
        large_image
      }
      fields {
        slug
      }
    }
  }
`;
