import * as React from "react";
import {SlideHorizontally} from "./SlideHorizontally";

export const SlideFromRight = (props: IProps) => (
    <SlideHorizontally initialY={100}
                     targetY={0}
                     style={props.style}
                     children={props.children}/>
);

interface IProps {
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement | React.ReactNode;
}
