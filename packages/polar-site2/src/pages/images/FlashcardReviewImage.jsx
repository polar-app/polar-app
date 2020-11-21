"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var gatsby_1 = require("gatsby");
var gatsby_image_1 = require("gatsby-image");
exports.default = (function (props) { return (<gatsby_1.StaticQuery query={gatsby_1.graphql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query {\n    file(relativePath: {eq: \"screenshots/2020-10-13-flashcard-review.png\"}) {\n      childImageSharp {\n        fluid(maxWidth: 1280) {\n            ...GatsbyImageSharpFluid_withWebp\n        }\n      }\n    }\n  }\n        "], ["\n  query {\n    file(relativePath: {eq: \"screenshots/2020-10-13-flashcard-review.png\"}) {\n      childImageSharp {\n        fluid(maxWidth: 1280) {\n            ...GatsbyImageSharpFluid_withWebp\n        }\n      }\n    }\n  }\n        "])))} render={function (data) { return (<gatsby_image_1.default fluid={data.file.childImageSharp.fluid} style={props.style} className={props.className} alt={props.alt}/>); }}/>); });
var templateObject_1;
