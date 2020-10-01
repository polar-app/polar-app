import React from "react"
import {graphql, StaticQuery} from "gatsby"
import Img from "gatsby-image"

interface IProps {

}
//
// export default ({ data }) => (
//     <StaticQuery
//         query={graphql`
//             query {
//                 file(relativePath: { eq: "assets/screenshots/2020-10-annotation-view.png" }) {
//                   imageSharp {
//                     # Specify the image processing specifications right in the query.
//                     # Makes it trivial to update as your page's design changes.
//                     fluid(maxWidth: 1280) {
//                       ...GatsbyImageSharpFixed
//                     }
//                   }
//                 }
//               }
//             }
//         `}
//         render={data => (
//             <Img fluid={data.file.imageSharp} />
//         )}
//     />
//
// )
