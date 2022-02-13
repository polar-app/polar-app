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
import {useErrorHandler} from "../../../../web/js/mui/MUIErrorHandler";
import {
    ICreateAccountForUserReferralFailed,
    ICreateAccountForUserReferralRequest
} from "polar-backend-api/src/api/CreateAccountForUserReferral";
import {isRPCError} from "polar-shared/src/util/IRPCError";
import {useHistory} from "react-router-dom";
import {MUIAppRoot} from "../../../../web/js/mui/MUIAppRoot";
import Box from "@material-ui/core/Box";

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

interface IProps {
    readonly user_referral_code: string;
}

export const InviteScreen = React.memo(function InviteScreen(props: IProps) {

    const {user_referral_code} = props;

    const classes = useStyles();
    const emailRef = React.useRef("");
    const errorHandler = useErrorHandler();
    const history = useHistory();

    // TODO require the user online...

    const handleCreateAccount = React.useCallback((email: string) => {


        async function doAsync() {

            const body: ICreateAccountForUserReferralRequest = {
                email,
                user_referral_code
            };

            const init: RequestInit = {
                mode: "cors",
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: 'follow',
                body: JSON.stringify(body)
            };

            const url = `https://us-central1-polar-32b0f.cloudfunctions.net/CreateAccountForUserReferral/`;

            const response = await fetch(url, init);

            if (isRPCError(response)) {

                switch (response.code) {

                    case "invalid-user-referral-code":
                        errorHandler("Unable to handle invite. Referral code is invalid.");
                        break;

                    case "failed":
                        errorHandler("Unable to handle invite. " + (response as ICreateAccountForUserReferralFailed).body.message);
                        break;

                }

            } else {
                history.push('/login');
            }

        }

        doAsync().catch(errorHandler);

    }, [errorHandler, user_referral_code, history])

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
        <MUIAppRoot useRedesign={false} darkMode={true}>

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
        </MUIAppRoot>
    );
});
