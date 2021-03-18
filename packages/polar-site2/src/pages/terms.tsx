import * as React from "react"
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { Box, CssBaseline, ThemeProvider } from "@material-ui/core";
import theme from "../gatsby-theme-material-ui-top-layout/docsTheme";

const Landing = ({ location }) => {
  return (
    <Layout>
      <SEO
        description="The Polar terms of service"
        title="Terms of Service"
        lang="en"
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          style={{
            margin: 0,
          }}
        >
          <Box style={{ width: "85vw", maxWidth: "890px", margin: "0 auto" }}>
            <h2 style={{ marginTop: "0px", paddingTop: "5%" }}>
              Polar Terms of Service
            </h2>
            <h3>1. Terms</h3>
            <p>
              By accessing the website at{" "}
              <a href="http://getpolarized.io">http://getpolarized.io</a>, you
              are agreeing to be bound by these terms of service, all applicable
              laws and regulations, and agree that you are responsible for
              compliance with any applicable local laws. If you do not agree
              with any of these terms, you are prohibited from using or
              accessing this site. The materials contained in this website are
              protected by applicable copyright and trademark law.
            </p>
            <h3>2. Use License</h3>
            <ol type="a">
              <li>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Polar's website for
                personal, non-commercial transitory viewing only. This is the
                grant of a license, not a transfer of title, and under this
                license you may not:
                <ol type="i">
                  <li>modify or copy the materials;</li>
                  <li>
                    use the materials for any commercial purpose, or for any
                    public display (commercial or non-commercial);
                  </li>
                  <li>
                    attempt to decompile or reverse engineer any software
                    contained on Polar's website;
                  </li>
                  <li>
                    remove any copyright or other proprietary notations from the
                    materials; or
                  </li>
                  <li>
                    transfer the materials to another person or "mirror" the
                    materials on any other server.
                  </li>
                </ol>
              </li>
              <li>
                This license shall automatically terminate if you violate any of
                these restrictions and may be terminated by Polar at any time.
                Upon terminating your viewing of these materials or upon the
                termination of this license, you must destroy any downloaded
                materials in your possession whether in electronic or printed
                format.
              </li>
            </ol>
            <h3>3. Disclaimer</h3>
            <ol type="a">
              <li>
                The materials on Polar's website are provided on an 'as is'
                basis. Polar makes no warranties, expressed or implied, and
                hereby disclaims and negates all other warranties including,
                without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of
                rights.
              </li>
              <li>
                Further, Polar does not warrant or make any representations
                concerning the accuracy, likely results, or reliability of the
                use of the materials on its website or otherwise relating to
                such materials or on any sites linked to this site.
              </li>
            </ol>
            <h3>4. Limitations</h3>
            <p>
              In no event shall Polar or its suppliers be liable for any damages
              (including, without limitation, damages for loss of data or
              profit, or due to business interruption) arising out of the use or
              inability to use the materials on Polar's website, even if Polar
              or a Polar authorized representative has been notified orally or
              in writing of the possibility of such damage. Because some
              jurisdictions do not allow limitations on implied warranties, or
              limitations of liability for consequential or incidental damages,
              these limitations may not apply to you.
            </p>
            <h3>5. Accuracy of materials</h3>
            <p>
              The materials appearing on Polar's website could include
              technical, typographical, or photographic errors. Polar does not
              warrant that any of the materials on its website are accurate,
              complete or current. Polar may make changes to the materials
              contained on its website at any time without notice. However Polar
              does not make any commitment to update the materials.
            </p>
            <h3>6. Links</h3>
            <p>
              Polar has not reviewed all of the sites linked to its website and
              is not responsible for the contents of any such linked site. The
              inclusion of any link does not imply endorsement by Polar of the
              site. Use of any such linked website is at the user's own risk.
            </p>
            <h3>7. Modifications</h3>
            <p>
              Polar may revise these terms of service for its website at any
              time without notice. By using this website you are agreeing to be
              bound by the then current version of these terms of service.
            </p>
            <h3>8. Governing Law</h3>
            <p style={{ marginBottom: "0px", paddingBottom: "5%" }}>
              These terms and conditions are governed by and construed in
              accordance with the laws of California and you irrevocably submit
              to the exclusive jurisdiction of the courts in that State or
              location.
            </p>
          </Box>
        </Box>
      </ThemeProvider>
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
