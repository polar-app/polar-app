import * as React from 'react';
import {MUIInlineErrorDialog, MUIErrorBoundaryMessage, MUIErrorBoundary} from "../../../web/js/mui/MUIErrorBoundary";

const ErrorRender = () => {

    const [failed, setFailed] = React.useState(false);

    setTimeout(() => setFailed(true), 1500);

    if (failed) {
        throw new Error("We failed")
    }

    return (
        <div>
            I'm about to die
        </div>
    );

}

export const ErrorBoundaryStory = () => {
    return (

        <MUIErrorBoundary>
            <>
                <ErrorRender/>
            </>
        </MUIErrorBoundary>
        // <MUIErrorBoundaryMessage/>
        // <DialogContent>
        //     <DialogTitle>this is the dialog</DialogTitle>
        // </DialogContent>

    )
}