import * as React from "react"
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
  const data: Data = {
    site: {
      siteMetadata: {
        author: {
          name: "Polar Team",
          summary: "Read. Learn. Never Forget."
        },
        social: {
          twitter: "getpolarized"
        }
      }
    }
  }

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
