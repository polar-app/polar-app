/* tslint:disable:no-var-keyword prefer-const */
import * as React from 'react';
import {useUserInfoContext} from "./auth_handler/UserInfoProvider";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import { useLocation } from 'react-router-dom';
import { useZenModeStore } from '../../mui/ZenModeStore';
import {IIntercomData, useIntercomClient} from "./IntercomHooks";

export function useIntercom() {

    const context = useUserInfoContext();
    // TODO: location is used so that we call 'update' but we might want to
    // decouple this into a new hook.
    const location = useLocation();
    const booted = React.useRef(false);
    const intercomClient = useIntercomClient();

    const userInfo = context?.userInfo;

    if (! userInfo) {
        return;
    }

    if (! intercomClient) {
        return;
    }

    // tslint:disable-next-line:variable-name
    const created_at = Math.floor(ISODateTimeStrings.parse(userInfo.creationTime).getTime() / 1000);

    const data: IIntercomData = {
        app_id: "wk5j7vo0",
        user_id: userInfo.uid,
        name: userInfo?.displayName || "",
        email: userInfo?.email,
        created_at: `${created_at}`
    };

    if (booted.current) {
        intercomClient.update(data);
    } else {
        intercomClient.boot(data);
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
