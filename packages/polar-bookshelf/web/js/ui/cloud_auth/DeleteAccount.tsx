import React, {useCallback} from "react";
import {useDialogManager} from "../../mui/dialogs/MUIDialogControllers";
import {useHistory} from "react-router-dom";
import {useLogoutCallback} from "../../accounts/AccountHooks";
import {JSONRPC} from "../../datastore/sharing/rpc/JSONRPC";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";

/**
 * This component will send a six-digit code to the user via email and show a text field
 * asking the user ot enter this code. Once entered, the user's account is completely purged
 * (through a cloud function) and the user is logged out
 */
export const DeleteAccount: React.FC = () => {

    const dialogs = useDialogManager();
    const history = useHistory();
    const logoutCallback = useLogoutCallback();

    const sendChallengeCode = useCallback(async () => await JSONRPC.exec<{}, unknown>('StartAccountDelete', {}), [])

    const handler = React.useCallback(async () => {
        let code = '';

        dialogs.confirm({
            type: 'danger',
            title: "Delete account",
            subtitle: <>
                <div>Please, enter the six-digit code, that was sent to your email to complete your account deletion.
                </div>
                <div>
                    <TextField label="Confirmation Code" onChange={event => code = event.target.value}/>
                </div>
                <br/>
                <div>Please note that account deletion is not reversible.</div>
            </>,
            onAccept: async () => {
                type IFinishAccountDeleteResponse = { code: 'ok' } | { code: 'invalid-challenge' };

                const response = await JSONRPC.exec<{ code: string }, IFinishAccountDeleteResponse>('FinishAccountDelete', {code});

                switch (response.code) {
                    case 'invalid-challenge':
                        dialogs.snackbar({
                            type: "error",
                            message: "Invalid challenge",
                        });
                        break;
                    case 'ok':
                        const AUTO_LOGOUT_INTERVAL = 3000;

                        dialogs.snackbar({
                            type: "success",
                            message: "Your account has been permanently deleted!",
                            autoHideDuration: AUTO_LOGOUT_INTERVAL,
                        });
                        setTimeout(() => logoutCallback(), AUTO_LOGOUT_INTERVAL);
                        break;
                }
            },
            onCancel: () => history.goBack(), // Go back to Account dialog
        });

        // Trigger the cloud function that sends the six-digit challenge code via email
        await sendChallengeCode();

    }, [dialogs, sendChallengeCode, logoutCallback, history]);

    return <Button onClick={handler}>Delete account</Button>
}
