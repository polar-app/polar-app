"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_helmet_1 = require("react-helmet");
var defaultPageData = {
    title: "POLAR: Read. Learn. Never Forget.",
    description: "POLAR is an integrated reading environment to build your knowledge base. Actively read, annotate, connect thoughts, create flashcards, and track progress.",
    twitter: 'getpolarized',
    // FIXME: this URL is wrong...
    image: "https://gatsby-mui.web.app/static/polar-icon-55956145ffc8674cab6a3d312777ae95.png",
    lang: 'en',
    card: 'summary'
};
function toURL(urlOrPath) {
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
var SEO = function (props) {
    var pageMetadata = {
        title: props.title || defaultPageData.title,
        description: props.description || defaultPageData.description,
        image: toURL(props.image || defaultPageData.image),
        twitter: props.twitter || defaultPageData.twitter,
        lang: props.lang || defaultPageData.lang,
        card: props.card || defaultPageData.card
    };
    var lang = pageMetadata.lang, title = pageMetadata.title, description = pageMetadata.description;
    return (<react_helmet_1.Helmet htmlAttributes={{
        lang: lang,
    }} title={title} titleTemplate={pageMetadata.title + " | %s "} meta={[
        {
            name: "description",
            content: description,
        },
        {
            property: "og:description",
            content: description,
        },
        {
            property: "og:type",
            content: "website",
        },
        {
            name: "twitter:card",
            content: pageMetadata.card,
        },
        {
            name: "twitter:creator",
            content: pageMetadata.twitter,
        },
        {
            name: "twitter:title",
            content: title,
        },
        {
            name: "twitter:description",
            content: description,
        },
        {
            name: "twitter:image",
            content: pageMetadata.image,
        },
    ]}/>);
};
exports.default = SEO;
