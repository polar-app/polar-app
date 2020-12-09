import * as React from 'react';
import {MUIInlineErrorDialog, MUIErrorBoundaryMessage} from "../../../web/js/mui/MUIErrorBoundary";

export const ScratchStory = () => {
    return (

        <MUIInlineErrorDialog>
            <>
                <MUIErrorBoundaryMessage/>
            </>
        </MUIInlineErrorDialog>
        // <MUIErrorBoundaryMessage/>
        // <DialogContent>
        //     <DialogTitle>this is the dialog</DialogTitle>
        // </DialogContent>

    )
}