import * as React from "react"
import AppleImg from "../../../content/assets/logos/apple.svg";

interface IProps {
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly alt?: string;
}

export default (props: IProps) => (
    <img src={AppleImg}
         style={props.style}
         className={props.className}
         alt={props.alt}
         />
);
