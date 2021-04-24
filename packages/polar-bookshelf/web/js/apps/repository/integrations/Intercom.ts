/* tslint:disable:no-var-keyword prefer-const */
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useZenModeStore } from '../../../mui/ZenModeStore';
import {createIntercomClient} from "../../../analytics/intercom/IntercomAnalytics";
import {useIntercomData} from "./IntercomHooks";

export function useIntercom() {

    // TODO: location is used so that we call 'update' but we might want to
    // decouple this into a new hook.
    const location = useLocation();
    const booted = React.useRef(false);
    const intercomClient = createIntercomClient();
    const intercomData = useIntercomData();

    if (! intercomClient) {
        return;
    }

    if (! intercomData) {
        return;
    }

    if (booted.current) {
        intercomClient.update(intercomData);
    } else {
        intercomClient.boot(intercomData);
    }

}

function useIntercomSideNavToggler() {

    const {zenMode} = useZenModeStore(['zenMode']);
    // intercom-launcher

    React.useEffect(() => {

        const launcher = document.querySelector('.intercom-launcher, .intercom-namespace') as HTMLElement;

        if (launcher) {

            // the intercom messenger hide/show methods won't hide the launcher

            if (zenMode) {
                // window.Intercom('hide');
                console.log("Hiding intercom");
                launcher.style.display = 'none';
            } else {
                // window.Intercom('show');
                console.log("Showing intercom");
                launcher.style.display = 'unset';
            }

        }

    }, [zenMode]);

}

export const Intercom = () => {
    useIntercom();
    useIntercomSideNavToggler();
    return null;
}
