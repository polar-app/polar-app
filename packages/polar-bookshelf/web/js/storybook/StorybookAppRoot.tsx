import * as React from "react";
import {MUIAppRoot} from "../mui/MUIAppRoot";
import {BrowserRouter} from "react-router-dom";

interface IProps {
    readonly children: React.ReactNode;
    readonly useRedesign?: boolean;
    readonly darkMode?: boolean;
}

export const StorybookAppRoot = React.memo(function StorybookAppRoot(props: IProps) {

    return (
        <BrowserRouter>
            <MUIAppRoot useRedesign={props.useRedesign} darkMode={props.darkMode}>
                {props.children}
            </MUIAppRoot>
        </BrowserRouter>
    );

});
