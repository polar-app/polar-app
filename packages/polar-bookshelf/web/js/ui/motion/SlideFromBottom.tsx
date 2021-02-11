import * as React from "react";
import {SlideVertically} from "./SlideVertically";

export const SlideFromBottom = (props: IProps) => (
    <SlideVertically initialY={30}
                     targetY={0}
                     style={props.style}
                     children={props.children}/>
);

interface IProps {
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement | React.ReactNode;
}
