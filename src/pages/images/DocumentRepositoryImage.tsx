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
    file(relativePath: {eq: "screenshots/2020-10-13-document-view.png"}) {
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


// TODO:
//
// - this version of the component won't compile. even with an absolute path.
// it says that data.file is null
//

// export default ({ data }) => (
//     <Img fluid={data.file.childImageSharp.fluid}
//          style={data.style}
//          className={data.className}
//          alt={data.alt}
//     />
// )
//
// export const query = graphql`
//   query {
//     file(relativePath: {eq: "screenshots/2020-10-annotation-view.png"}) {
//       childImageSharp {
//         fluid(maxWidth: 1280) {
//             ...GatsbyImageSharpFluid_withWebp
//         }
//       }
//     }
//   }
// `
