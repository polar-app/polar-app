import React from "react";
import {AdaptiveDialog} from "../../../../web/js/mui/AdaptiveDialog";
import {Intercom} from "../../../../web/js/apps/repository/integrations/Intercom";
import {SVGIcon} from "../../../../web/js/ui/svg_icons/SVGIcon";
import {GiftSVGIcon} from "../../../../web/js/ui/svg_icons/GiftSVGIcon";
import TextField from "@material-ui/core/TextField";
import EmailIcon from "@material-ui/icons/Email";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import Button from "@material-ui/core/Button";
import {useParams} from "react-router-dom";
import {Preconditions} from "polar-shared/src/Preconditions";
import {JSONRPC} from "../../../../web/js/datastore/sharing/rpc/JSONRPC";
import {useErrorHandler} from "../../../../web/js/mui/MUIErrorHandler";
import {
    ICreateAccountForUserReferralRequest,
    ICreateAccountForUserReferralResponse
} from "polar-backend-api/src/api/CreateAccountForUserReferral";

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

interface IInviteParams {
    readonly user_referral_code: string;
}

function useInviteParams(): IInviteParams {

    const {user_referral_code} = useParams() as any;

    Preconditions.assertPresent(user_referral_code, 'user_referral_code');

    return {user_referral_code};

}

export const InviteScreen = React.memo(function InviteScreen() {

    const classes = useStyles();

    const emailRef = React.useRef("");

    const errorHandler = useErrorHandler();

    const {user_referral_code} = useInviteParams();

    const handleCreateAccount = React.useCallback((email: string) => {

        const request: ICreateAccountForUserReferralRequest = {
            email,
            user_referral_code
        };

        async function doAsync() {
            const response = await JSONRPC.exec<unknown, ICreateAccountForUserReferralResponse>('CreateAccountForUserReferral', request);
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

                            <div className="m-2">
                                <SVGIcon size={150}>
                                    <GiftSVGIcon/>
                                </SVGIcon>
                            </div>

                            <h1 className="title">You've been Invited to Polar!</h1>

                            <h2>
                                One free month of premium on us!
                            </h2>

                            <TextField autoFocus={true}
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
