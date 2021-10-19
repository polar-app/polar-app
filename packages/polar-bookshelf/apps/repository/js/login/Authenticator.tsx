import React from 'react';
import Paper from '@material-ui/core/Paper';
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import Button from '@material-ui/core/Button';
import EmailIcon from '@material-ui/icons/Email';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import createStyles from '@material-ui/core/styles/createStyles';
import {Box, Divider, Typography} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router-dom';
import {useAuthHandler, useTriggerStartTokenAuth, useTriggerVerifyTokenAuth} from './AuthenticatorHooks';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Analytics} from "../../../../web/js/analytics/Analytics";
import {Intercom} from "../../../../web/js/apps/repository/integrations/Intercom";
import {useStateRef} from '../../../../web/js/hooks/ReactHooks';
import {AuthLegalDisclaimer} from "./AuthLegalDisclaimer";
import {JSONRPC} from "../../../../web/js/datastore/sharing/rpc/JSONRPC";

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
            // marginLeft: theme.spacing(3),
            // marginRight: theme.spacing(3),
        },

        alternate: {
            margin: theme.spacing(1),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
            textAlign: 'center'
        },
        progress: {
            height: theme.spacing(1),
            // marginLeft: theme.spacing(3),
            // marginRight: theme.spacing(3),
        },
        Divider: {
            margin: '10px'
        }
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

const EmailTokenAuthButton = () => {

    const classes = useStyles();

    interface IAlert {
        readonly type: 'error' | 'success';
        readonly message: string;
    }

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


        } catch(err) {
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

        } catch(err) {
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
            <div style={{
                display: 'flex',
                margin: '4%',
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
                                           }} />

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

                        {! triggered && (
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
                                startIcon={<EmailIcon />}/>
                )}
            </div>
        </>
    );
};

const RegisterForBetaButton = () => {

    const [isRegistered, setIsRegistered] = React.useState<boolean>(false);
    const [pending, setPending] = React.useState(false);
    const emailRef = React.useRef("");

    const classes = useStyles();

    const handleClick = React.useCallback(() => {

        const request = {
            email: emailRef.current.trim(),
            tag: "initial_signup",
        };

        try {

            setPending(true);

            async function doAsync() {

                await JSONRPC.exec<unknown, any>('private-beta/register', request);
                setIsRegistered(true);

                console.log("Registered now!");

            }

            doAsync()
                .catch(err => console.error(err));

        } finally {
            setPending(false);
        }

    }, [setPending]);

    return (
        <>
            {isRegistered && (
                <h2>
                    Thank you for registering!
                </h2>
            )}

            <BackendProgress pending={pending}/>

            {!isRegistered && (
                <div style={{
                    margin: '4%',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <TextField autoFocus={true}
                               className={classes.email}
                               onChange={event => emailRef.current = event.target.value}
                               placeholder="Enter your email address"
                               InputProps={{
                                   startAdornment: (
                                       <EmailIcon style={{margin: '8px'}}/>
                                   )}}
                               variant="outlined"/>

                    <Button variant="contained"
                            size="large"
                            color="primary"
                            className={classes.button}
                            onClick={handleClick}>
                        Get Started
                    </Button>
                </div>
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

const LogoAndTextSideBySide = () => {
    return (
        <div>
            <div style={{display: 'flex'}}>
                <div style={{marginRight: 'auto', marginLeft: 'auto', display: 'flex', alignItems: "center"}}>
                    <Box m={1}>
                        <PolarSVGIcon width={100} height={100}/>
                    </Box>
                    <Box m={1}>
                        <Typography variant="h2" component="div">
                            POLAR
                        </Typography>
                    </Box>
                </div>
            </div>
        </div>
    )
}

const FlexLayoutForm = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column'
        }}>

            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>

                <EmailTokenAuthButton/>

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

    const classes = useStyles();

    return (
        <>
            <div className="AuthContent"
                 style={{
                     height:"100vh",
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
                    </h2>

                    <Divider className={classes.Divider}/>

                    {props.children}

                </>

                {props.alternative}

                <div style={{flexGrow: 1}}/>

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

interface AdaptiveDialogProps {
    readonly children: React.ReactNode;
}

/**
 * Dialog that adapts itself to phones by not having itself wrapped in a 'paper' dialog.
 */
export const AdaptiveDialog = React.memo(function AdaptiveDialog(props: AdaptiveDialogProps) {

    return (
        <>
            <DeviceRouters.NotPhone>
                <div style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%'
                }}>

                    <Paper style={{
                        margin: 'auto',
                        maxWidth: '450px',
                        minHeight: '450px',
                        maxHeight: '650px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>

                        {props.children}

                    </Paper>
                </div>
            </DeviceRouters.NotPhone>

            <DeviceRouters.Phone>
                <>
                    {props.children}
                </>
            </DeviceRouters.Phone>
        </>
    );

});

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
