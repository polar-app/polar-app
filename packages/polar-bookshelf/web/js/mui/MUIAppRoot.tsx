import * as React from "react";
import {KeyboardShortcuts} from "../keyboard_shortcuts/KeyboardShortcuts";
import {UndoQueueProvider2} from "../undo/UndoQueueProvider2";
import {MUIErrorBoundary} from "./MUIErrorBoundary";

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIAppRoot = React.memo(function MUIAppRoot(props: IProps) {

    return (
        <>
            <KeyboardShortcuts/>
            <UndoQueueProvider2>
                <MUIErrorBoundary>
                    <>
                        {props.children}
                    </>
                </MUIErrorBoundary>
            </UndoQueueProvider2>
        </>
    );

});
