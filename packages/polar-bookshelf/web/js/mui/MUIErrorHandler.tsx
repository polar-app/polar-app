import {useDialogManager} from "./dialogs/MUIDialogControllers";
import React from "react";
import {SentryBrowserLogger} from "../logger/SentryBrowserLogger";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export type ErrorHandler = (msg: string, ...args: any[]) => void;

/**
 * Used so that we can use our MUI error dialog if an error was raised.
 */
export function useErrorHandler(): ErrorHandler {

    const dialogManager = useDialogManager();
    const sentryLogger = React.useMemo(() => new SentryBrowserLogger(), []);

    const createErrorDialog = React.useCallback((msg: string | undefined) => {

        const title = 'Internal Error';

        const subtitle = `An internal error has occurred: ` + (msg || 'No message given');

        dialogManager.confirm({
            type: 'error',
            title,
            subtitle,
            noCancel: true,
            onAccept: NULL_FUNCTION
        });

    }, [dialogManager]);

    const handleErrorWithDialog = React.useCallback((msg: string, ...args: any[]) => {

        if (args.length > 0 && args[0] instanceof Error) {

            const createMessage = () => {

                const err = args[0];

                if (err.message && err.message !== '') {
                    return err.message;
                } else {
                    return undefined;
                }

            };

            const message = createMessage();
            createErrorDialog(message);

        } else {
            createErrorDialog(msg);
        }

    }, [createErrorDialog]);

    return React.useCallback((msg: string, ...args: any[]) => {

        console.error(msg, ...args);
        handleErrorWithDialog(msg, ...args);
        sentryLogger.error(msg, ...args)

    }, [handleErrorWithDialog, sentryLogger]);

}
