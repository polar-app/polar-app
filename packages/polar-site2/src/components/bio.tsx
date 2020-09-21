import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Link from "@material-ui/core/Link";
const polarLogo = require("../../content/assets/polar-icon.png");

type Data = {
  site: {
    siteMetadata: {
      author: {
        name: string;
        summary: string;
      };
      social: {
        twitter: string;
      };
    };
  };
};

const Bio = () => {
  const data: Data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `);

  const { author, social } = data.site.siteMetadata;
  return (
    <div>
      <div
        style={{
          display: `flex`,
          marginBottom: "3%",
          marginTop: "3%",
        }}
      >
        <img
          src={polarLogo}
          alt={author.name}
          style={{
            marginBottom: 0,
            width: 60,
            height: 60,

            borderRadius: `500%`,
          }}
        />
        <p style={{ marginLeft: "8px", marginTop: "0px" }}>
          Written by <strong>{author.name}</strong> {author.summary}
          {` `}
          <a
            // color="BROKEN_ON_PURPOSE"

            href={`https://twitter.com/${social.twitter}`}
          >
            You should follow us on Twitter
          </a>
        </p>
      </div>
    </div>
  );
};

export default Bio;
