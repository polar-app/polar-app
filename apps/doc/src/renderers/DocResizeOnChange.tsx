import * as React from 'react';
import {useDocViewerStore} from "../DocViewerStore"
import {useDocumentChangeCallback} from "./UseDocumentChangeCallbackHook";

export const DocResizeOnChange = () => {

    const {resizer} = useDocViewerStore(['resizer'])

    const handleResize = React.useCallback(() => {

        if (resizer) {
            resizer();
        }

    }, [resizer]);

    useDocumentChangeCallback(handleResize);

    return null;

}