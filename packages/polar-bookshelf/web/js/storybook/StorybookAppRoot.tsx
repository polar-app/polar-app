import * as React from "react";
import {MUIAppRoot} from "../mui/MUIAppRoot";
import {BrowserRouter} from "react-router-dom";

interface IProps {
    readonly children: React.ReactNode;
}

export const StorybookAppRoot = React.memo(function StorybookAppRoot(props: IProps) {

    return (
        <BrowserRouter>
            <MUIAppRoot useRedesign={false} darkMode={true}>
                {props.children}
            </MUIAppRoot>
        </BrowserRouter>
    );

});
