import React from "react"
import {graphql, StaticQuery} from "gatsby"
import Img from "gatsby-image"

interface IProps {

}

export default () => (
    <StaticQuery
        query={graphql`
            query {
  file(absolutePath: {eq: "/Users/burton/projects/polar-app/packages/polar-site2/content/assets/screenshots/2020-10-annotation-view.png"}) {
    childImageSharp {
      fluid(maxWidth: 1280) {
          base64
          aspectRatio
          src
          srcSet
          sizes
      }
    }
  }
}

        `}
        render={data => (
            <Img fluid={data.file.childImageSharp.fluid} />
        )}
    />

)
