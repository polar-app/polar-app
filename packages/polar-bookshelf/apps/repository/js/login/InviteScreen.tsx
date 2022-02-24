import React from "react";
import {AdaptiveDialog} from "../../../../web/js/mui/AdaptiveDialog";
import {Intercom} from "../../../../web/js/apps/repository/integrations/Intercom";
import {SVGIcon} from "../../../../web/js/icons/SVGIcon";
import {GiftSVGIcon} from "../../../../web/js/icons/GiftSVGIcon";
import TextField from "@material-ui/core/TextField";
import EmailIcon from "@material-ui/icons/Email";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import Button from "@material-ui/core/Button";
import {JSONRPC} from "../../../../web/js/datastore/sharing/rpc/JSONRPC";
import {useErrorHandler} from "../../../../web/js/mui/useErrorHandler";
import {
    ICreateAccountForUserReferralError,
    ICreateAccountForUserReferralRequest,
    ICreateAccountForUserReferralResponse
} from "polar-backend-api/src/api/CreateAccountForUserReferral";
import {isRPCError} from "polar-shared/src/util/IRPCError";
import Box from "@material-ui/core/Box";
import {FirebaseAuth} from "../../../../web/js/firebase/FirebaseAuth";
import {handleAuthResultForNewUser} from "./AuthenticatorHooks";
import {InviteScreenURLs} from "./InviteScreenURLs";

export const useStyles = makeStyles((theme) =>
    createStyles({

        root: {
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            margin: theme.spacing(1)
        },

        button: {
            flexGrow: 1,
            margin: theme.spacing(1),
        },

        email: {
            flexGrow: 1,
            margin: theme.spacing(1),
        },

    }),
);

export const InviteScreen = React.memo(function InviteScreen() {

    const inviteScreenURL = React.useMemo(() => InviteScreenURLs.parse(document.location.href), []);

    const user_referral_code = inviteScreenURL?.user_referral_code;

    const classes = useStyles();
    const emailRef = React.useRef("");
    const errorHandler = useErrorHandler();

    const handleCreateAccount = React.useCallback((email: string) => {

        if (! user_referral_code) {
            console.error("No user_referral_code: " + user_referral_code);
            return;
        }

        const request: ICreateAccountForUserReferralRequest = {
            email,
            user_referral_code
        };

        async function doAsync() {

            const response = await JSONRPC.execWithoutAuth<ICreateAccountForUserReferralRequest,
                                                           ICreateAccountForUserReferralResponse | ICreateAccountForUserReferralError>('CreateAccountForUserReferral', request);

            if (isRPCError(response)) {

                switch (response.code) {

                    case "invalid-user-referral-code":
                        errorHandler("Unable to handle invite. Referral code is invalid.");
                        break;

                    case "failed":
                        errorHandler("Unable to handle invite. " + response.message);
                        break;

                    case "not-university-email":
                        errorHandler('This is not a valid university email');
                        break;
                }

            } else {

                await FirebaseAuth.loginWithCustomToken(response.auth_token);
                handleAuthResultForNewUser('user_referral_code');

            }

        }

        doAsync().catch(errorHandler);

    }, [errorHandler, user_referral_code])

    const handleEmailProvided = React.useCallback(() => {

        const email = emailRef.current.trim();

        if (email !== '') {
            handleCreateAccount(email);
        }

    }, [handleCreateAccount]);

    const handleKeyPressEnter = React.useCallback((event: React.KeyboardEvent<any>, callback: () => void) => {

        if (event.key === 'Enter') {
            callback();
        }

    }, []);

    return (

            <AdaptiveDialog>
                <>

                    {/*<AuthContent title="" alternative={<div/>}>*/}
                        <div className={classes.root}>

                                <Box mt={2}>
                                    <SVGIcon size={150}>
                                        <GiftSVGIcon/>
                                    </SVGIcon>
                                </Box>

                                <h1 className="title">You've been Invited to Polar!</h1>

                                <h2>
                                    One free month of premium on us!
                                </h2>

                                <TextField autoFocus={true}
                                           size="medium"
                                           className={classes.email}
                                           onChange={event => emailRef.current = event.target.value}
                                           onKeyPress={event => handleKeyPressEnter(event, handleEmailProvided)}
                                           placeholder="Enter your email address"
                                           variant="outlined"
                                           type="email"
                                           style={{
                                               textAlign: 'center',
                                               flexGrow: 1,
                                           }}
                                           InputProps={{
                                               startAdornment: (
                                                   <EmailIcon style={{margin: '8px'}}/>
                                               )
                                           }}/>

                                <Button variant="contained"
                                        color="primary"
                                        size="large"
                                        className={classes.button}
                                        onClick={() => handleEmailProvided()}>

                                    Create Free Account

                                </Button>


                        </div>
                    {/*</AuthContent>*/}

                    <Intercom/>
                </>
            </AdaptiveDialog>
    );
});

