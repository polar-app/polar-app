import * as React from "react";
import {UndoQueueProvider2} from "../undo/UndoQueueProvider2";
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
            <UndoQueueProvider2>
                <MUIErrorBoundary>
                    <MUIDialogController>
                        <>
                            {props.children}
                        </>
                    </MUIDialogController>
                </MUIErrorBoundary>
            </UndoQueueProvider2>
        </MUIThemeRoot>
    );

});
