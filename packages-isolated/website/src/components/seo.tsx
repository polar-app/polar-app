import * as React from "react"
import { Helmet } from "react-helmet";

export type CardType = 'summary' | 'summary_large_image';

interface IPageMetadata {
    readonly title: string;
    readonly description: string;
    readonly image?: string;
    readonly twitter?: string;
    readonly lang?: string;
    readonly card?: CardType;
}

const defaultPageData: IPageMetadata = {
    title: "POLAR: Read. Learn. Never Forget.",
    description: "POLAR is an integrated reading environment to build your knowledge base. Actively read, annotate, connect thoughts, create flashcards, and track progress.",
    twitter: 'getpolarized',
    // FIXME: this URL is wrong...
    image: "https://gatsby-mui.web.app/static/polar-icon-55956145ffc8674cab6a3d312777ae95.png",
    lang: 'en',
    card: 'summary'
}

function toURL(urlOrPath: string) {

    if (urlOrPath.startsWith('/')) {
        return 'https://getpolarized.io' + urlOrPath;
    }

    return urlOrPath;

}

/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */
const SEO = (props: Partial<IPageMetadata>) => {
  const pageMetadata: IPageMetadata = {
      title: props.title || defaultPageData.title,
      description: props.description || defaultPageData.description,
      image: toURL(props.image || defaultPageData.image),
      twitter: props.twitter || defaultPageData.twitter,
      lang: props.lang || defaultPageData.lang,
      card: props.card || defaultPageData.card
  };

  const {lang, title, description} = pageMetadata;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`${pageMetadata.title} | %s `}
      meta={[
        {
          name: `description`,
          content: description,
        },
        {
          property: `og:description`,
          content: description,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: pageMetadata.card,
        },
        {
          name: `twitter:creator`,
          content: pageMetadata.twitter,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: description,
        },
        {
          name: `twitter:image`,
          content: pageMetadata.image,
        },
      ]}
    />
  );
};

export default SEO;
