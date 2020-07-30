import React from 'react';
import {useDocViewerJumpListener} from "./DocViewerAnnotationHook";

/**
 * Called once the EPUB is active to load the current URL annotation plus
 * to handle the navigation jumps.
 */
export const DocViewerAnnotationRouter = React.memo(() => {
    useDocViewerJumpListener();
    return null;
});
