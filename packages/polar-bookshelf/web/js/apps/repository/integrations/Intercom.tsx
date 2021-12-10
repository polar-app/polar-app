/* tslint:disable:no-var-keyword prefer-const */
import * as React from 'react';
import {useLocation} from 'react-router-dom';
import {useZenModeStore} from '../../../mui/ZenModeStore';
import {createIntercomClient} from "../../../analytics/intercom/IntercomAnalytics";
import {useIntercomData} from "./IntercomHooks";
import {Devices} from "polar-shared/src/util/Devices";

export function useIntercom() {

    // TODO: location is used so that we call 'update' but we might want to
    // decouple this into a new hook.
    const location = useLocation();
    const booted = React.useRef(false);
    const intercomClient = createIntercomClient();
    const intercomData = useIntercomData();

    if (!Devices.isDesktop()) {
        // for right now, intercom on a tablet doesn't make a ton of sense.
        return;
    }

    if (!intercomClient) {
        return;
    }

    if (!intercomData) {
        return;
    }

    if (booted.current) {
        intercomClient.update({
            ...intercomData,
        });
    } else {
        intercomClient.boot({
            ...intercomData,
        });
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

const IntercomInner = () => {
    useIntercom();
    useIntercomSideNavToggler();
    return null;
}

export const Intercom = () => {

    // Comment if you want to see Intercom locally
    // if (document.location.href.startsWith('https://')) {
    return (
        <IntercomInner/>
    )
    // }

    return null;

}

export const IntercomIcon: React.FC = () => {
    return <svg width="100%" height="100%" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M35 40C35 40 29.1075 37.6813 24.3412 35.825H4.29625C1.925 35.825 0 33.7825 0 31.2663V4.555C0 2.04125 1.925 0 4.29625 0H30.7025C33.075 0 34.9987 2.04 34.9987 4.55625V27.5612H35V40ZM29.8263 25.0225C29.7326 24.9023 29.6151 24.8029 29.4811 24.7306C29.347 24.6582 29.1994 24.6145 29.0476 24.6021C28.8958 24.5898 28.743 24.6091 28.5991 24.6589C28.4551 24.7086 28.323 24.7878 28.2113 24.8913C28.1737 24.9237 24.4425 28.2425 17.4987 28.2425C10.6412 28.2425 6.8525 24.9475 6.785 24.8875C6.67309 24.7846 6.54106 24.706 6.39725 24.6566C6.25343 24.6073 6.10095 24.5883 5.94943 24.6009C5.79791 24.6135 5.65064 24.6573 5.51692 24.7297C5.38319 24.802 5.26592 24.9013 5.1725 25.0212C4.97241 25.2709 4.87456 25.5872 4.89875 25.9062C4.91988 26.2237 5.06219 26.5208 5.29625 26.7362C5.47375 26.8962 9.7175 30.6737 17.4987 30.6737C25.2812 30.6737 29.525 26.8962 29.7025 26.7362C29.9361 26.5206 30.0779 26.2235 30.0988 25.9062C30.123 25.5878 30.0256 25.272 29.8263 25.0225Z"
            fill="#757575"/>
    </svg>;
};
