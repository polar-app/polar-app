import * as React from "react"
import {graphql, StaticQuery} from "gatsby"
import Img from "gatsby-image"

interface IProps {
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly alt?: string;
}

export default (props: IProps) => (
    <StaticQuery
        query={graphql`
  query {
    file(relativePath: {eq: "screenshots/Dark-Mode-Dark.png"}) {
      childImageSharp {
        fluid(maxWidth: 1280) {
            ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
        `}
        render={data => (
            <Img fluid={data.file.childImageSharp.fluid}
                 style={props.style}
                 className={props.className}
                 alt={props.alt}
            />
        )}
    />

);
