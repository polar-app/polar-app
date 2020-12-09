import * as React from 'react';
import {MUIErrorBoundary} from "../../../web/js/mui/MUIErrorBoundary";

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

export const ScratchStory = () => {

    const occupations = [
        'College Student',
        'Graduate Student',
        'Faculty',
        'Software Engineer'
    ];

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