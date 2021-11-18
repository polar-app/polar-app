import * as React from "react"
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { Box } from "@material-ui/core";

const NotFoundPage = ({ data, location }) => {
  // const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout>
      {/*<SEO*/}
      {/*  title="404: Not Found"*/}
      {/*  lang="en"*/}
      {/*  description="404 page for non-existent link"*/}
      {/*/>*/}
      <Box
        style={{
          height: "100vh",
          paddingLeft: "5%",
        }}
      >
        <h1 style={{ marginTop: "0px", paddingTop: "5%" }}>
          404 Page Not Found
        </h1>
        <p>This page does not exist!</p>
        <p>
          Click <a href={"/"}>here</a> to return to the homepage.
        </p>
      </Box>
    </Layout>
  );
};

export default NotFoundPage;
