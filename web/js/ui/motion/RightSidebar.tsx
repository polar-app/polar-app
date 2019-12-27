import * as React from "react";
import {Sidebar} from "./Sidebar";

export const RightSidebar = (props: IProps) => {

    return (
        <Sidebar style={{right: 0, ...props.style}} initialX={100} targetX={0}>
            {props.children}
        </Sidebar>
    );

};

interface IProps {
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement;
}
