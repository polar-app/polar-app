import * as React from "react";
import {MUIDialogController} from "./dialogs/MUIDialogController";
import {MUIErrorBoundary} from "./MUIErrorBoundary";
import {MUIThemeRoot} from "./MUIThemeRoot";

interface IProps {
    readonly children: React.ReactNode;
    readonly useRedesign: boolean;
    readonly darkMode: boolean;
}

export const MUIAppRoot = React.memo(function MUIAppRoot(props: IProps) {

    return (
        <MUIThemeRoot useRedesign={props.useRedesign} darkMode={props.darkMode}>
            <MUIErrorBoundary>
                <MUIDialogController>
                    {props.children}
                </MUIDialogController>
            </MUIErrorBoundary>
        </MUIThemeRoot>
    );

});
