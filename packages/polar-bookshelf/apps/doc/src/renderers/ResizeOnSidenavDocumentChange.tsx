import * as React from 'react';
import {useDocViewerStore} from "../DocViewerStore"
import {SIDE_NAV_ENABLED} from "../../../../web/js/sidenav/SideNavStore";
import {useSidenavDocumentChangeCallback} from "./UseDocumentChangeCallbackHook";
import { Functions } from 'polar-shared/src/util/Functions';

export const ResizeOnSidenavDocumentChange = () => {

    const {resizer} = useDocViewerStore(['resizer'])

    const handleResize = React.useCallback(() => {

        if (SIDE_NAV_ENABLED &&  resizer) {
            // this is a hack because the iframe for EPUBs hasn't yet been
            // resized so we need to allow the current code to execute before
            // firing the resize and the timeout queue will do this for us.
            Functions.withTimeout(() => resizer());
        }

    }, [resizer]);

    useSidenavDocumentChangeCallback(handleResize);

    return null;

}
