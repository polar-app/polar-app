import React from 'react';
import {ConsoleRecorder} from "polar-shared/src/util/ConsoleRecorder";
import {Button, Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {DevBuild} from "../../util/DevBuild";
import deepEqual from "deep-equal";
import IConsoleMessage = ConsoleRecorder.IConsoleMessage;
import isDevBuild = DevBuild.isDevBuild;


function consoleErrorsSnapshot() {
    return ConsoleRecorder.snapshot().filter(current => ['error', 'warn'].includes(current.level));
}

function useConsoleErrors() {

    const [messages, setMessages] = React.useState<ReadonlyArray<IConsoleMessage>>(consoleErrorsSnapshot());

    const handlePostMessage = React.useCallback((event: MessageEvent<any>) => {

        if (event.data.type === ConsoleRecorder.CHANNEL) {
            setMessages(consoleErrorsSnapshot())
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


function categorizeMessages(messages: ReadonlyArray<IConsoleMessage>): 'invalid-expected-signature' | 'too-many-unexpected' | 'valid' {

    // We have to do TWO things here. We have to verify existing errors are
    // accepted. If we just whitelist them we will never know when they were
    // successfully removed and they could get resolved, then sneak back in. The
    // idea here is that we the build will fail in the future, then we can
    // remove the expected messages then.

    type Label = 'expected' | 'unexpected';

    interface LabelWithMatch {
        readonly label: Label;
        readonly message: string;
        readonly match: string | undefined;
    }

    function computeLabelWithMatch(message: string): LabelWithMatch {

        const expectations: ReadonlyArray<string> = [
            "@firebase/firestore:", // this is a hack but I don't care
            "@firebase/firestore: Firestore (8.10.0): You are overriding the original host. If you did not intend to override your settings, use {merge: true}.",
            "Material-UI: The `css` function is deprecated. Use the `styleFunctionSx` instead.",
            'Warning: React.createFactory() is deprecated and w…SX or use React.createElement() directly instead.',
            'Warning: forwardRef render functions accept exactly two parameters: props and ref. %s',
            'Not registering service worker - localhost/webpack-dev-server',
            "Warning: React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead."
        ];

        for (const current of expectations) {
            if (message.indexOf(current) !== -1) {
                return {
                    message,
                    label: 'expected',
                    match: current
                }
            }
        }

        return {label: 'unexpected', message, match: undefined}

    }

    const messagesWithLabels =
        messages.map(current => current.message)
                .map(current => computeLabelWithMatch(current))

    const expected = messagesWithLabels.filter(current => current.label === 'expected')
                                       .filter(current => current.match !== undefined)
                                       .map(current => current.match)
                                       .sort((a, b) => a!.localeCompare(b!))

    const unexpectedFilter = (match: LabelWithMatch) => {
        return ! match.message.startsWith("Slow task");
    }

    const unexpected = messagesWithLabels.filter(current => current.label === 'unexpected')
                                         .filter(current => unexpectedFilter(current));

    // the accepted array of messages we accept from the expected...
    const accepted = [
        "@firebase/firestore:",
        "Material-UI: The `css` function is deprecated. Use the `styleFunctionSx` instead.",
        "Not registering service worker - localhost/webpack-dev-server",
        "Warning: forwardRef render functions accept exactly two parameters: props and ref. %s",
        "Warning: React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead."
    ];

    if (! deepEqual(expected, accepted)) {
        console.log("Did not expect messages: ", expected);
        return 'invalid-expected-signature';
    }

    if (unexpected.length > 0) {
        console.log("Too many unexpected messages: ", unexpected);
        return 'too-many-unexpected';
    }

    return 'valid';

}

export const ConsoleError = React.memo(() => {

    const messages = useConsoleErrors();

    const [disabled, doDisable] = useDisabler();

    if (disabled) {
        return null;
    }

    if (! isDevBuild()) {
        return null;
    }

    const error = categorizeMessages(messages);

    if (error === 'valid') {
        return null;
    }

    return (
        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center' }}
                  className="ConsoleError"
                  open={true}>

            <Alert severity="error"
                   action={<Button onClick={doDisable}>Disable Future Notifications</Button>}>
                We've encountered an internal error.  Please see console logs: {error}
            </Alert>

        </Snackbar>
    )

});
