import * as React from "react";
import {Sidebar} from "./Sidebar";

export const LeftSidebar = (props: IProps) => (
    <Sidebar {...props}
             style={{
                 left: 0
             }}
             borderBarClassName="border-right"
             buttonBarClassName="text-right"/>
);

interface IProps {
    readonly width?: number;
    readonly style?: React.CSSProperties;
    readonly fullscreen?: boolean;
    readonly children: React.ReactElement;
    readonly onClose: () => void;
}
