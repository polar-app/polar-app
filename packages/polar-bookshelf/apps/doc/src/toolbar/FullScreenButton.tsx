import * as React from "react";
import {useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import FullscreenIcon from '@material-ui/icons/Fullscreen';

export const FullScreenButton = React.memo(() => {

    // TODO: shift+command+f for macos full-screen
    // make this a hook that we can reuse...

    const requestFullScreen = React.useCallback(() => {

        async function doAsync() {
            await document.documentElement.requestFullscreen();
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

    const toggleFullScreen = React.useCallback(() => {
        if (document.fullscreenElement) {
            exitFullScreen();
        } else {
            requestFullScreen();
        }
    }, [exitFullScreen, requestFullScreen]);

    return (
        <IconButton onClick={toggleFullScreen}>
            <FullscreenIcon/>
        </IconButton>
    )

});
