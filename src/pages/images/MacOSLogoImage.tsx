import * as React from "react"
import Img from "../../../content/assets/logos/macosx.svg";

interface IProps {
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly alt?: string;
}

export default (props: IProps) => (
    <img src={Img}
         style={props.style}
         className={props.className}
         alt={props.alt}
         />
);
