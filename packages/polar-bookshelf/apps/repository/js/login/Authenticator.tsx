import React from 'react';
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import Button from '@material-ui/core/Button';
import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {Box, Typography, Divider} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router-dom';
import {useAuthHandler, useTriggerStartTokenAuth, useTriggerVerifyTokenAuth} from './AuthenticatorHooks';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Analytics, useAnalytics} from "../../../../web/js/analytics/Analytics";
import {Intercom} from "../../../../web/js/apps/repository/integrations/Intercom";
import {useStateRef} from '../../../../web/js/hooks/ReactHooks';
import {AuthLegalDisclaimer} from "./AuthLegalDisclaimer";
import {JSONRPC} from "../../../../web/js/datastore/sharing/rpc/JSONRPC";
import {AdaptiveDialog} from "../../../../web/js/mui/AdaptiveDialog";
import {EmailAddressParser} from '../../../../web/js/util/EmailAddressParser';
import {IRPCError} from "polar-shared/src/util/IRPCError";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";

export const useStyles = makeStyles((theme) =>
    createStyles({

        email: {
            flexGrow: 1,
            margin: theme.spacing(1),
        },

        button: {
            flexGrow: 1,
            margin: theme.spacing(1),
        },

        alert: {
            margin: theme.spacing(1),
        },

        alternate: {
            margin: theme.spacing(1),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
            textAlign: 'center'
        },
        progress: {
            height: theme.spacing(1),
        },
    }),
);

interface IAuthButtonProps {
    readonly startIcon: React.ReactNode;
    readonly onClick: () => void;
    readonly strategy: string;
    readonly style?: React.CSSProperties;
}

const AuthButton = (props: IAuthButtonProps) => {

    const classes = useStyles();

    const mode = React.useContext(AuthenticatorModeContext);

    const hint = mode === 'create-account' ? 'Get Started' : 'Sign In'

    return (
        <>

            <Button variant="contained"
                    color="primary"
                    size="large"
                    className={classes.button}
                    onClick={props.onClick}
                    style={{
                        flexGrow: 1
                    }}>

                {hint} with {props.strategy}
            </Button>

        </>
    );
}

const BackendProgressInactive = () => {

    const classes = useStyles();

    return (
        <div className={classes.progress}>

        </div>
    );
}

const BackendProgressActive = () => {
    const classes = useStyles();

    return (
        <div className={classes.progress}>
            <LinearProgress/>
        </div>
    );
}

interface BackendProgressProps {
    readonly pending: boolean;
}

const BackendProgress = (props: BackendProgressProps) => {

    if (props.pending) {
        return <BackendProgressActive/>;
    }

    return <BackendProgressInactive/>

}

interface IAlert {
    readonly type: 'error' | 'success';
    readonly message: string;
}

const EmailTokenAuthButton = () => {

    const classes = useStyles();

    const [pending, setPending] = React.useState(false);
    const [alert, setAlert] = React.useState<IAlert | undefined>();
    const [active, setActive] = React.useState(true);
    const [triggered, setTriggered, triggeredRef] = useStateRef(false);

    const triggerStartTokenAuth = useTriggerStartTokenAuth();
    const triggerVerifyTokenAuth = useTriggerVerifyTokenAuth();

    const emailRef = React.useRef("");
    const challengeRef = React.useRef("");

    const emailBeingVerifiedRef = React.useRef("");

    const doTriggerVerifyTokenAuth = React.useCallback(async (email: string, challenge: string) => {

        setAlert(undefined);

        try {

            try {
                setPending(true);

                await triggerVerifyTokenAuth(email, challenge);
            } finally {
                setPending(false);
            }


        } catch (err) {
            setAlert({
                type: 'error',
                message: (err as any).message
            });
        }

    }, [triggerVerifyTokenAuth]);

    const handleTriggerVerifyTokenAuth = React.useCallback(() => {

        const email = emailBeingVerifiedRef.current.trim();
        const challenge = challengeRef.current.replace(/ /g, "");

        doTriggerVerifyTokenAuth(email, challenge)
            .catch(err => console.log("Unable to handle auth: ", err));

    }, [doTriggerVerifyTokenAuth])

    const doTriggerStartTokenAuth = React.useCallback(async (email: string) => {

        setAlert(undefined);

        try {

            try {

                Analytics.event2("auth:EmailTokenAuthStarted", {resend: triggeredRef.current})

                setPending(true);

                await triggerStartTokenAuth(email, triggeredRef.current);

                setTriggered(true);

                setAlert({
                    type: 'success',
                    message: 'Check your email for a code to login to your account!'
                });

            } finally {
                setPending(false);
            }

        } catch (err) {
            setAlert({
                type: 'error',
                message: (err as any).message
            });
        }

    }, [triggerStartTokenAuth, setTriggered, triggeredRef]);

    const handleTriggerStartTokenAuth = React.useCallback((email: string) => {

        Analytics.event2("auth:EmailTokenAuthTriggered", {resend: triggeredRef.current})

        emailBeingVerifiedRef.current = email;

        doTriggerStartTokenAuth(email)
            .catch(err => console.log("Unable to handle auth: ", err));

    }, [doTriggerStartTokenAuth, triggeredRef])

    const handleKeyPressEnter = React.useCallback((event: React.KeyboardEvent<any>, callback: () => void) => {

        if (event.key === 'Enter') {
            callback();
        }

    }, []);

    const handleEmailProvided = React.useCallback(() => {

        const email = emailRef.current.trim();

        if (email !== '') {
            handleTriggerStartTokenAuth(email);
        }

    }, [handleTriggerStartTokenAuth]);

    const handleClick = React.useCallback(() => {

        if (active) {

            if (triggered) {

                if (challengeRef.current.trim() !== '') {
                    handleTriggerVerifyTokenAuth();
                }

            } else {
                handleEmailProvided();
            }

        } else {
            Analytics.event2("auth:EmailTokenAuthActivated")
            setActive(true)
        }

    }, [active, handleEmailProvided, handleTriggerVerifyTokenAuth, triggered])

    return (
        <>
            <Box px={2} style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1
            }}>
                {active && (
                    <>

                        <BackendProgress pending={pending}/>

                        {alert && (
                            <Alert severity={alert.type}
                                   className={classes.alert}>
                                {alert.message}
                            </Alert>
                        )}

                        {triggered && (
                            <>
                                <TextField autoFocus={true}
                                           className={classes.email}
                                           onChange={event => challengeRef.current = event.target.value}
                                           onKeyPress={event => handleKeyPressEnter(event, handleTriggerVerifyTokenAuth)}
                                           placeholder="Enter your Code Here"
                                           variant="outlined"
                                           style={{
                                               textAlign: 'center',
                                               flexGrow: 1,
                                           }}/>

                                <div className={classes.alternate}>
                                    <Button onClick={handleEmailProvided}>Resend Email</Button>
                                </div>

                                <Button variant="contained"
                                        color="primary"
                                        size="large"
                                        className={classes.button}
                                        onClick={handleClick}
                                        style={{
                                            textAlign: 'center',
                                            flexGrow: 1,
                                        }}>
                                    Verify Code
                                </Button>
                            </>
                        )}

                        {!triggered && (
                            <TextField autoFocus={true}
                                       className={classes.email}
                                       onChange={event => emailRef.current = event.target.value}
                                       onKeyPress={event => handleKeyPressEnter(event, handleEmailProvided)}
                                       placeholder="Enter your email address"
                                       variant="outlined"
                                       style={{
                                           textAlign: 'center',
                                           flexGrow: 1,
                                       }}
                                       InputProps={{
                                           startAdornment: (
                                               <EmailIcon style={{margin: '8px'}}/>
                                           )
                                       }}/>
                        )}
                    </>
                )}

                {!triggered && (
                    <AuthButton onClick={handleClick}
                                strategy="Email"
                                startIcon={<EmailIcon/>}/>
                )}
            </Box>
        </>
    );
};

export const RegisterForBetaButton = () => {

    const [isRegistered, setIsRegistered] = React.useState<boolean>(false);
    const [pending, setPending] = React.useState(false);
    const [alert, setAlert] = React.useState<IAlert | undefined>();

    const emailRef = React.useRef("");
    const codeRef = React.useRef("");

    const classes = useStyles();

    const analytics = useAnalytics();
    const dialogManager = useDialogManager();

    const handleClick = React.useCallback(() => {
        const email = emailRef.current.trim();

        const request = {
            email: email,
            tag: codeRef.current || "initial_signup",
        };

        if (EmailAddressParser.parse(email).length < 1) {
            setAlert({
                type: 'error',
                message: 'Unable to register email: The email address is improperly formatted.'
            });
            return;
        }

        try {

            setPending(true);

            async function doAsync() {

                interface IRegisterForPrivateBetaErrorFailed extends IRPCError<'failed'> {
                    readonly message: string;
                }

                type RegisterResponse = {} | IRegisterForPrivateBetaErrorFailed;

                const register = await JSONRPC.exec<unknown, RegisterResponse>('private-beta/register', request);
                if ('message' in register) {
                    dialogManager.snackbar({
                        type: "error",
                        message: register.message,
                    });
                    return;
                }
                setIsRegistered(true);

                // @TODO also store the Referral code, once we start capturing it during signup
                analytics.event2("private_beta_joined", {});

                console.log("Registered now!");
            }

            doAsync()
                .catch(err => console.error(err));

        } finally {
            setPending(false);
        }

    }, [setPending, analytics, dialogManager]);

    return (
        <>
            {isRegistered && (
                <h2>
                    Thank you for registering!
                </h2>
            )}

            <BackendProgress pending={pending}/>

            {alert && (
                <Alert severity={alert.type}
                       className={classes.alert}>
                    {alert.message}
                </Alert>
            )}

            {!isRegistered && (
                <Box component='div' px={2} style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <TextField autoFocus={true}
                               className={classes.email}
                               onChange={event => emailRef.current = event.target.value}
                               placeholder="Enter your email address"
                               InputProps={{
                                   startAdornment: (
                                       <EmailIcon style={{margin: '8px'}}/>
                                   )
                               }}
                               variant="outlined"/>

                    <TextField autoFocus={true}
                               className={classes.email}
                               onChange={event => codeRef.current = event.target.value}
                               placeholder="Referral code (optional)"
                               InputProps={{
                                   startAdornment: (
                                       <VpnKeyIcon style={{margin: '8px'}}/>
                                   )
                               }}
                               variant="outlined"/>

                    <Button variant="contained"
                            size="large"
                            color="primary"
                            className={classes.button}
                            onClick={handleClick}>
                        Join
                    </Button>
                </Box>
            )}
        </>
    )
}

const SignInWithExistingAccountButton = () => {

    const history = useHistory();

    return (
        <div style={{textAlign: 'center'}}>
            <Button variant="text" onClick={() => history.push('/sign-in')}>
                or sign-in with existing account
            </Button>
        </div>
    );
}

const OrCreateNewAccountButton = () => {
    const history = useHistory();
    return (
        <div style={{textAlign: 'center'}}>
            <Button variant="text" onClick={() => history.push('/create-account')}>
                or register for private beta
            </Button>
        </div>
    );
}

export const LogoAndTextSideBySide = () => {
    return (
        <div>
            <div style={{display: 'flex'}}>
                <div style={{marginRight: 'auto', marginLeft: 'auto', display: 'flex', alignItems: "center"}}>
                    <Box m={1}>
                        <PolarSVGIcon width={100} height={100}/>
                    </Box>
                    <Box m={1}>
                        <Typography variant="h2" component="div" style={{fontWeight: 400}}>
                            POLAR
                        </Typography>
                    </Box>
                </div>
            </div>
        </div>
    )
}

interface AuthContentProps {
    readonly title: string;
    readonly children: React.ReactNode;
    readonly alternative: React.ReactNode;
}

/**
 * Auth content wrapper which adds the logo, any title text.
 */
const AuthContent = React.memo(function AuthContent(props: AuthContentProps) {

    return (
        <>
            <div className="AuthContent"
                 style={{
                     height: "100vh",
                     maxHeight: '650px',
                     textAlign: 'center',
                     flexGrow: 1,
                     display: 'flex',
                     flexDirection: 'column'
                 }}>

                <>
                    <div style={{
                        display: 'flex',
                        flexGrow: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <LogoAndTextSideBySide/>
                    </div>

                    <h2>
                        {props.title}

                        <Box ml={2} mr={2} mt={1} mb={1} flexGrow={1}>
                            <Divider/>
                        </Box>
                    </h2>

                    {props.children}

                </>

                {props.alternative}

                <Box m={2} flexGrow={1}>
                    <Divider/>
                </Box>
                <AuthLegalDisclaimer/>
            </div>
        </>
    );
});

export const PrivateBetaRegisterAuthContent = () => {
    return (
        <AuthContent title="Join the Waiting List"
                     alternative={<SignInWithExistingAccountButton/>}>

            <RegisterForBetaButton/>

        </AuthContent>
    )
}

export const SignInAuthContent = () => {
    return (
        <AuthContent title="Sign In to Polar"
                     alternative={<OrCreateNewAccountButton/>}>
            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <EmailTokenAuthButton/>
            </div>
        </AuthContent>
    )
}

const Pending = () => {
    return (
        <div style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <CircularProgress style={{width: '150px', height: '150px'}}/>
        </div>
    )
}

export type AuthenticatorMode = 'create-account' | 'sign-in';

interface IProps {
    readonly mode: AuthenticatorMode;
}

const AuthenticatorModeContext = React.createContext<AuthenticatorMode>(null!);

// TODO: get rid of the 'mode' in props and make a SignInAuthenticator and an
// PrivateBetaAuthenticator or CreateAccountAuthenticator

export const Authenticator = React.memo(function Authenticator(props: IProps) {

    const authStatus = useAuthHandler();

    return (
        <AuthenticatorModeContext.Provider value={props.mode}>
            <AdaptiveDialog>
                <>

                    {authStatus === undefined && (
                        <Pending/>
                    )}

                    {authStatus === 'needs-auth' && props.mode === 'create-account' && (
                        <PrivateBetaRegisterAuthContent/>
                    )}

                    {authStatus === 'needs-auth' && props.mode === 'sign-in' && (
                        <SignInAuthContent/>
                    )}

                    <Intercom/>
                </>
            </AdaptiveDialog>
        </AuthenticatorModeContext.Provider>
    );
});
