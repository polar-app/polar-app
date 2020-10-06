import * as React from "react"
import * as PropTypes from "prop-types";
// import { PageProps } from "gatsby"
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

type Data = {
  site: {
    siteMetadata: {
      title: string;
      description: string;
      social: {
        twitter: string;
      };
    };
  };
};

const SiteData: Data = {
  site: {
    siteMetadata: {
      title: "POLAR: Read. Learn. Never Forget.",
      description: "POLAR is an integrated reading environment to build your knowledge base. Actively read, annotate, connect thoughts, create flashcards, and track progress.",
      social: {
        twitter: 'getpolarized'
      }
    }
  }
}

const TWITTER_IMAGE =
  "https://gatsby-mui.web.app/static/polar-icon-55956145ffc8674cab6a3d312777ae95.png";

/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */
const SEO = ({ description, lang, meta, title }) => {
  const { site }: Data = SiteData;

  const metaDescription = description || site.siteMetadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`${site.siteMetadata.title}  | %s `}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.social.twitter,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:image`,
          content: TWITTER_IMAGE,
        },
      ].concat(meta)}
    />
  );
};

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
};

export default SEO;
