import * as React from "react";
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import {StandardIconButton} from "../../../repository/js/doc_repo/buttons/StandardIconButton";
import {Analytics} from "../../../../web/js/analytics/Analytics";

export function useFullScreenToggle() {

    const requestFullScreen = React.useCallback(() => {

        async function doAsync() {
            await document.documentElement.requestFullscreen();
            Analytics.event2('global-fullscreenModeEnabled');
        }

        doAsync()
            .catch(err => console.error(err));

    }, []);

    const exitFullScreen = React.useCallback(() => {

        async function doAsync() {
            await document.exitFullscreen();
        }

        doAsync()
            .catch(err => console.error(err));

    }, []);

    return React.useCallback(() => {
        if (document.fullscreenElement) {
            exitFullScreen();
        } else {
            requestFullScreen();
        }
    }, [exitFullScreen, requestFullScreen]);
}

export const FullScreenButton = React.memo(function FullScreenButton() {

    const fullScreenToggle = useFullScreenToggle();

    return (
        <StandardIconButton tooltip="Full screen"
                            onClick={fullScreenToggle}>
            <FullscreenIcon/>
        </StandardIconButton>
    );

});
