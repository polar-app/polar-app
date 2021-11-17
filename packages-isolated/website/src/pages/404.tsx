import * as React from "react"

import Layout from "../components/layout";
import { Box } from "@material-ui/core";
import { MUIAnchor } from "../../../../packages/polar-bookshelf/web/js/mui/MUIAnchor";

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
          Click <MUIAnchor href={"/"}>here</MUIAnchor> to return to the homepage.
        </p>
      </Box>
    </Layout>
  );
};

export default NotFoundPage;
