import * as React from "react"
import {graphql, StaticQuery} from "gatsby"
import Img from "gatsby-image"

interface IProps {

}

// does GatsbyImageSharpFluid work? NO ... it does not and I get a build error even with a clean build.
// YES... it does!

// ??GatsbyImageSharpFluid_withWebp

export default () => (
    <StaticQuery
        query={graphql`
            query {
  file(absolutePath: {eq: "/Users/burton/projects/polar-app/packages/polar-site2/content/assets/screenshots/2020-10-annotation-view.png"}) {
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

)
