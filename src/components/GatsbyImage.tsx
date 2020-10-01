import React from "react"
import {graphql, StaticQuery} from "gatsby"
import Img from "gatsby-image"

interface IProps {

}

export default () => (
    <StaticQuery
        query={graphql`
            query {
                file(relativePath: { eq: "content/assets/screenshots/2020-10-annotation-view.png" }) {
                  childImageSharp {
                    # Specify the image processing specifications right in the query.
                    # Makes it trivial to update as your page's design changes.
                    fluid(maxWidth: 1280) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
            }
        `}
        render={data => (
            <Img fluid={data.file.childImageSharp} />
        )}
    />

)
