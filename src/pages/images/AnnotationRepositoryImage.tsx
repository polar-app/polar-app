import React from "react"
import {graphql, StaticQuery} from "gatsby"
import Img from "gatsby-image"

export default React.memo(() => (
    <StaticQuery
        query={graphql`
            query {
  file(relativePath: {eq: "screenshots/2020-10-annotation-view.png"}) {
    childImageSharp {
      fluid(maxWidth: 1280) {
          ...GatsbyImageSharpFluid_withWebp
      }
    }
  }
}
        `}
        render={data => (
            <Img fluid={data.file.childImageSharp.fluid} />
        )}
    />

));
