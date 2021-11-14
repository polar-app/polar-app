import React from 'react';
import {ConsoleRecorder} from "polar-shared/src/util/ConsoleRecorder";
import {Button, Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {DevBuild} from "../../util/DevBuild";
import IConsoleMessage = ConsoleRecorder.IConsoleMessage;
import isDevBuild = DevBuild.isDevBuild;

export function useConsoleMessages() {

    const [messages, setMessages] = React.useState<ReadonlyArray<IConsoleMessage>>(ConsoleRecorder.snapshot());

    const handlePostMessage = React.useCallback((event: MessageEvent<any>) => {

        if (event.data.type === ConsoleRecorder.CHANNEL) {
            setMessages(ConsoleRecorder.snapshot())
        }

    }, []);

    React.useEffect(() => {

        // TODO: This won't work with any internal messages like with iframe within epub.

        window.addEventListener('message', handlePostMessage);

        return () => {
            window.removeEventListener('message', handlePostMessage);
        }

    });

    return messages;

}



function useDisabler(): Readonly<[boolean, () => void]> {

    const key = 'console-messages.enabled';

    const [disabled, setDisabled] = React.useState(() => localStorage.getItem(key) === 'true');

    const doDisable = React.useCallback(() => {
        localStorage.setItem(key, 'true');
        setDisabled(true);
    }, []);

    return [disabled, doDisable];

}

export const ConsoleMessages = React.memo(() => {

    console.log("FIXMEL: within console messages");

    const messages = useConsoleMessages();

    const [disabled, doDisable] = useDisabler();

    if (disabled) {
        console.log("FIXME3");
        return null;
    }

    if (! isDevBuild()) {
        console.log("FIXME4");
        return null;
    }

    if (messages.length === 0) {
        console.log("FIXME5");
        return null;
    }


    return (
        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center' }}
                  open={true}>

            <Alert severity="error"
                   action={<Button onClick={doDisable}>Disable Future Notifications</Button>}>
                We've encountered an internal error.  Please see console logs.
            </Alert>

        </Snackbar>
    )

});
