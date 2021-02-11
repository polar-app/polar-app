import * as React from "react";
import {Sidebar} from "./Sidebar";


interface IProps {
    readonly width?: number;
    readonly style?: React.CSSProperties;
    readonly fullscreen?: boolean;
    readonly children: React.ReactElement;
    readonly onClose: () => void;
}

export const LeftSidebar = React.memo((props: IProps) => (
    <Sidebar {...props}
             style={{
                 left: 0
             }}
             borderBarClassName="border-right"
             buttonBarClassName="text-right"/>
));
