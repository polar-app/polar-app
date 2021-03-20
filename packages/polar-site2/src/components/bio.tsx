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
          marginBottom: "3%",
          marginTop: "3%",
          display: "flex",
          alignItems: "center" ,
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
        <p style={{ marginLeft: "16px" }}>
          <div>Written by <strong>{author.name}</strong></div>
          <div>
            {author.summary}
            &nbsp;
            <a
              href={`https://twitter.com/${social.twitter}`}
            >
              Follow us on Twitter
            </a>
          </div>
        </p>
      </div>
    </div>
  );
};

export default Bio;
