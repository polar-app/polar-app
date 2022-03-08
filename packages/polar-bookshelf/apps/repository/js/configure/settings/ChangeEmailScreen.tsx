import * as React from 'react';
import Box from '@material-ui/core/Box';
import {AdaptivePageLayout} from "../../page_layout/AdaptivePageLayout";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {useDialogManager} from "../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useErrorHandler} from "../../../../../web/js/mui/useErrorHandler";
import {useFirestore} from "../../FirestoreProvider";
import {EmailStr} from "polar-shared/src/util/Strings";
import {AccountActions} from "../../../../../web/js/accounts/AccountActions";
import {useHistory} from "react-router-dom";
import EmailIcon from "@material-ui/icons/Email";
import {EmailAddressParser} from "../../../../../web/js/util/EmailAddressParser";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

const Main = () => {

    const dialogManager = useDialogManager();
    const errorHandler = useErrorHandler();
    const history = useHistory();

    const {user} = useFirestore();

    const textFieldRef = React.useRef<HTMLDivElement | null>();

    const doUpdateEmail = React.useCallback((email: EmailStr) => {

        async function doAsync() {

            await user!.updateEmail(email);
            await AccountActions.logout();

            history.push("/login");

        }
        doAsync().catch(errorHandler);

    }, [dialogManager, errorHandler, history]);

    const handleUpdateEmail = React.useCallback(() => {

        // TODO: we should probably keep a log SOMEWHERE of when the user is
        // changing their email so if it breaks we don't lock them out

        const email = textFieldRef.current!.textContent!;

        if (EmailAddressParser.parse(email).length < 1) {

            dialogManager.confirm({
                type: 'error',
                title: "Invalid Email",
                subtitle: "Please use a proper email address",
                noCancel: true,
                onAccept: NULL_FUNCTION
            });

            return;

        }

        dialogManager.confirm({
            title: "Confirm Email Update",
            subtitle: `Are you sure you want to update your email to: '${email}'`,
            onAccept: () => doUpdateEmail(email)
        });

    }, [dialogManager, errorHandler, doUpdateEmail]);

    return (
        <Box p={1}
             style={{
                 display: 'flex',
                 flexDirection: 'column',
                 maxWidth: '450px',
                 textAlign: 'center',
                 margin: 'auto'
             }}>

            <h1>Change Email</h1>

            <p>This will change your primary account email.  <b>Note that you MUST
            be able to receive email on this email or you will lose access to
            your account.</b></p>

            <Box mt="4"
                 style={{
                     display: 'flex',
                 }}>

                <TextField autoFocus={true}
                           variant="outlined"
                           style={{flexGrow: 1}}
                           ref={ref => textFieldRef.current = ref}
                           InputProps={{
                               startAdornment: (
                                   <EmailIcon style={{margin: '8px'}}/>
                               )
                           }}
                           value=""/>

                <Button color="primary"
                        size="large"
                        onClick={handleUpdateEmail}
                        style={{whiteSpace: 'nowrap', marginLeft: '5px'}}
                        variant="contained">
                    Change Email
                </Button>

            </Box>

        </Box>
    );
}


export const ReferralScreen = React.memo(function ReferralScreen() {

    return (
        <AdaptivePageLayout title="Change Email">
            <Main/>
        </AdaptivePageLayout>
    );
});
