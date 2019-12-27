import * as React from "react";
import {Sidebar} from "./Sidebar";

export const LeftSidebar = (props: IProps) => {


    return (
        <Sidebar style={{left: 0, ...props.style}} initialX={-100} targetX={0}>
            {props.children}
        </Sidebar>
    );

};

interface IProps {
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement;
}
