import * as React from "react"
import {graphql, StaticQuery} from "gatsby"
import Img from "gatsby-image"

interface IProps {
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly alt?: string;
}

// export default (props: IProps) => (
//     <StaticQuery
//         query={graphql`
//   query {
//     file(relativePath: {eq: "logos/apple.svg"}) {
//        publicURL
//     }
//   }
//         `}
//         render={data => (
//             <div>hello world</div>
//             // <img src={data.file.publicURL}
//             //      style={props.style}
//             //      className={props.className}
//             //      alt={props.alt}
//             //      />
//         )}
//     />
//
// );

export default (props: IProps) => (
    <div>helo world</div>
);

export const query = graphql`
  query {
    file(relativePath: {eq: "screenshots/2020-10-annotation-view.png"}) {
      childImageSharp {
        fluid(maxWidth: 1280) {
            ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`