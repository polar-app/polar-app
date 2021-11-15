import * as React from "react"
import { Box, ThemeProvider, CssBaseline } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { StaticQuery, graphql } from "gatsby";

const useStyles = makeStyles({
  header: {
    margin: "0px 14px auto 14px",

    borderBottom: "1.5px solid #816DE8",
    fontWeight: 500,
    fontSize: "15px",
  },
  background: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },

  indexItem: {
    transform: "scale(1)",
    transition: "all .2s",

    // "&:hover": {
    //   boxShadow: " 4px 2px 40px 3px #424242",
    //   borderBottom: "10px solid #816DE8",
    //   borderRadius: "4px",
    //
    //   transform: "scale(1.01)",
    // },
    padding: "0px 10px",
    margin: "auto 14px",
    color: "#ffffff",
    textDecoration: "none",
    backgroundColor: "#606060",
  },
  hidden: { display: "none" },

  title: { color: "#ffffff", fontWeight: 500 },
});

export default function BlogAside() {
  const classes = useStyles();

  return (
    <StaticQuery
      query={graphql`
        query HeadingQuery {
          allMarkdownRemark(
            filter: { frontmatter: { editorsChoice: { eq: true } } }
          ) {
            edges {
              node {
                frontmatter {
                  editorsChoice
                  date(formatString: "MM-DD-YYYY")
                  title
                }
                fields {
                  slug
                }
              }
            }
          }
        }
      `}
      render={(data) => (
        <Box className={classes.background}>
          <Box className={classes.header}>Featured Articles</Box>
          {data.allMarkdownRemark.edges.map((article) => (
            <Box className={classes.indexItem}>
              <a
                style={{ color: "#ffffff", textDecoration: "none" }}
                href={article.node.fields.slug}
              >
                <p className={classes.title}>
                  {article.node.frontmatter.title}
                </p>
              </a>
              <p>{article.node.frontmatter.date}</p>
            </Box>
          ))}
        </Box>
      )}
    />
  );
}
