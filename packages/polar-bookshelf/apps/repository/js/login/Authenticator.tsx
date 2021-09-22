import React from 'react';
import Paper from '@material-ui/core/Paper';
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import Button from '@material-ui/core/Button';
import {FAGoogleIcon} from "../../../../web/js/mui/MUIFontAwesome";
import EmailIcon from '@material-ui/icons/Email';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import createStyles from '@material-ui/core/styles/createStyles';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router-dom';
import {
    useAuthHandler,
    useTriggerFirebaseEmailAuth,
    useTriggerFirebaseGoogleAuth,
    useTriggerStartTokenAuth,
    useTriggerVerifyTokenAuth
} from './AuthenticatorHooks';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Analytics} from "../../../../web/js/analytics/Analytics";
import {Intercom} from "../../../../web/js/apps/repository/integrations/Intercom";
import {useStateRef} from '../../../../web/js/hooks/ReactHooks';

const useStyles = makeStyles((theme) =>
    createStyles({

        logo: {
            marginTop: theme.spacing(2),
        },
        button: {
            flexGrow: 1,
            margin: theme.spacing(1),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
            fontSize: '1.5em'
        },
        intro: {
            color: theme.palette.text.secondary,
            fontSize: '2.2em'
        },

        divider: {
            margin: theme.spacing(1),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
        },

        sendLinkDivider: {
            margin: theme.spacing(1),
            marginBottom: theme.spacing(3),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
        },

        alert: {
            margin: theme.spacing(1),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
        },

        email: {
            margin: theme.spacing(1),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
        },
        legal: {
            margin: theme.spacing(1),
            marginTop: theme.spacing(5),
            marginBottom: theme.spacing(2),
            color: theme.palette.text.secondary,
            fontSize: '1.5em',
            textAlign: 'center',
            "& a:link": {
                color: theme.palette.text.secondary,
                textDecoration: 'none'
            },
            "& a:visited": {
                color: theme.palette.text.secondary,
                textDecoration: 'none'
            },
            "& a:hover": {
                color: theme.palette.text.secondary,
                textDecoration: 'none'
            },
            "& a:active": {
                color: theme.palette.text.secondary,
                textDecoration: 'none'
            },
        },
        alternate: {
            margin: theme.spacing(1),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
            textAlign: 'center'
        },
        progress: {
            height: theme.spacing(1),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
        },
        linkDecoration: {
            color: theme.palette.secondary.main,
            textDecoration: 'underline'
        },
        a: {
            color: theme.palette.text.secondary,
            textDecoration: 'underline'
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

    const hint = mode === 'create-account' ? 'Continue' : 'Sign In'

    return (
        <>
            <Button variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={props.onClick}
                    startIcon={props.startIcon}
                    style={props.style}>

                {hint} with {props.strategy}

            </Button>

        </>
    );
}

const AuthButtonMobile = (props: IAuthButtonProps) => {
    return (
        <AuthButtonMobile {...props}
                          style={{width: '95vw', margin: '10px', textAlign: 'center'}}/>
    );
}

const Links = () => {

    const classes = useStyles();

    const mode = React.useContext(AuthenticatorModeContext);

    return (
        <>
            <p className={classes.legal}>
                You acknowledge that you will read, and agree to
                our <a className={classes.linkDecoration} href="https://getpolarized.io/terms/">Terms of Service</a> and <a className={classes.linkDecoration} href="https://getpolarized.io/privacy-policy">Privacy Policy</a>.
            </p>
        </>
    );
}

const GoogleAuthButton = () => {

    const classes = useStyles();
    const [error, setError] = React.useState<string | undefined>();

    const triggerAuth = useTriggerFirebaseGoogleAuth();

    const doTriggerAuth = React.useCallback(async () => {

        Analytics.event2("auth:GoogleAuthButtonTriggered")

        setError(undefined);

        try {
            await triggerAuth();
        } catch (err) {
            setError((err as any).message || 'error')
        }

    }, [triggerAuth]);

    const handleTriggerAuth = React.useCallback(async () => {

        Analytics.event2("auth:GoogleAuthActivated")

        doTriggerAuth()
            .catch(err => console.log("Unable to handle auth: ", err));

    }, [doTriggerAuth]);

    return (
        <>
            {error && (
                <Alert severity="error"
                       className={classes.alert}>
                    {error}
                </Alert>
            )}

            <AuthButton onClick={handleTriggerAuth}
                        strategy="Google"
                        startIcon={<FAGoogleIcon />}/>

        </>
    );
}


const ProgressInactive = () => {

    const classes = useStyles();

    return (
        <div className={classes.progress}>

        </div>
    );
}

const ProgressActive = () => {
    const classes = useStyles();

    return (
        <div className={classes.progress}>
            <LinearProgress/>
        </div>
    );
}

const EmailTokenAuthButtonNotPhone = () => {

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
                message: err.message
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
                message: err.message
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
            {active && (
                <>
                    <Divider className={classes.sendLinkDivider}/>

                    {pending && (
                        <ProgressActive/>
                    )}

                    {! pending && (
                        <ProgressInactive/>
                    )}

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
                                       variant="outlined" />

                            <div className={classes.alternate}>
                                <Button onClick={handleEmailProvided}>Resend Email</Button>
                            </div>
                            <Button variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={handleClick}>
                                Verify Code
                            </Button>
                        </>
                    )}

                    {! triggered && (
                        <TextField autoFocus={true}
                                   className={classes.email}
                                   onChange={event => emailRef.current = event.target.value}
                                   onKeyPress={event => handleKeyPressEnter(event, handleEmailProvided)}
                                   placeholder="email@"
                                   variant="outlined" />
                    )}

                </>
            )}

            {!triggered && (

                <AuthButton onClick={handleClick}
                            strategy="Email"
                            startIcon={<EmailIcon />}
                            />
            )}

            <Divider className={classes.sendLinkDivider}/>
        </>
    );
};

// end comp 1

const EmailTokenAuthButtonPhone = () => {

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
                message: (err as any).message || undefined
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
                message: (err as any).message || 'error'
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
            {active && (
                <>
                    <Divider className={classes.sendLinkDivider}/>

                    {pending && (
                        <ProgressActive/>
                    )}

                    {! pending && (
                        <ProgressInactive/>
                    )}

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
                                       style={{width: '95vw', margin: '10px', textAlign: 'center'}}/>

                            <div className={classes.alternate}>
                                <Button onClick={handleEmailProvided}>Resend Email</Button>
                            </div>
                            <Button variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={handleClick}
                                    style={{width: '95vw', margin: '10px', textAlign: 'center'}}>
                                Verify Code
                            </Button>
                        </>
                    )}

                    {! triggered && (
                        <TextField autoFocus={true}
                                   className={classes.email}
                                   onChange={event => emailRef.current = event.target.value}
                                   onKeyPress={event => handleKeyPressEnter(event, handleEmailProvided)}
                                   placeholder="email@"
                                   variant="outlined"
                                   style={{width: '95vw', margin: '10px', textAlign: 'center'}} />
                    )}

                </>
            )}

            {!triggered && (

                <AuthButtonMobile onClick={handleClick}
                            strategy="Email"
                            startIcon={<EmailIcon />}
                            />
            )}

            <Divider className={classes.sendLinkDivider}/>
        </>
    );
};

const EmailAuthButton = () => {

    const classes = useStyles();

    const [error, setError] = React.useState<string | undefined>();

    const [active, setActive] = React.useState(false);
    const [triggered, setTriggered] = React.useState(false);

    const triggerFirebaseEmailAuth = useTriggerFirebaseEmailAuth();

    const emailRef = React.useRef("");

    const doTriggerAuth = React.useCallback(async (email: string) => {

        setError(undefined);

        try {
            localStorage.setItem('emailForSignIn', email);
            await triggerFirebaseEmailAuth(email);
            setTriggered(true);
        } catch(err) {
            setError((err as any).message);
        }

    }, [triggerFirebaseEmailAuth]);

    const handleAuth = React.useCallback(() => {

        doTriggerAuth(emailRef.current)
            .catch(err => console.log("Unable to handle auth: ", err));

    }, [doTriggerAuth])

    const handleKeyPress = React.useCallback((event: React.KeyboardEvent<any>) => {

        if (event.key === 'Enter') {
            handleAuth();
        }

    }, [handleAuth]);

    const handleClick = React.useCallback(() => {

        if (active) {

            if (emailRef.current.trim() !== '') {
                handleAuth();
            }

        } else {
            setActive(true)
        }

    }, [active, handleAuth])

    return (
        <>
            {active && (
                <>
                    <Divider className={classes.sendLinkDivider}/>

                    {error && (
                        <Alert severity="error"
                               className={classes.alert}>
                            {error}
                        </Alert>
                    )}

                    {triggered && (
                        <Alert severity="success"
                               className={classes.alert}>Check your email for a link to login to your new Polar account!</Alert>
                    )}

                    <TextField autoFocus={true}
                               className={classes.email}
                               onChange={event => emailRef.current = event.target.value}
                               onKeyPress={handleKeyPress}
                               placeholder="Enter your email address... "
                               variant="outlined" />
                </>
            )}

            <AuthButton onClick={handleClick}
                        strategy="Email"
                        startIcon={<EmailIcon />}/>

        </>
    );
};

const SignInWithExistingAccount = () => {

    const classes = useStyles();
    const history = useHistory();

    return (

        <div className={classes.alternate} onClick={() => history.push('/sign-in')}>
            <Button>or sign-in with existing account</Button>
        </div>
    );

}

const OrCreateNewAccount = () => {

    const classes = useStyles();
    const history = useHistory();

    return (
        <div className={classes.alternate} onClick={() => history.push('/create-account')}>
            <Button>or create new account</Button>
        </div>
    );

}

const Main = React.memo(function Main(props: IProps) {

    const classes = useStyles();

    return (

        <>
            <DeviceRouters.NotPhone>
            <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>

            <div id="firebaseui-auth-container" style={{display: 'none'}}/>

            <div className="text-center">

                <div className={classes.logo}>
                    <PolarSVGIcon width={125} height={125}/>
                </div>


                {props.mode === 'create-account' && (
                    <h2 className={classes.intro}>
                        Create your Polar Account
                    </h2>
                )}

                {props.mode === 'sign-in' && (
                    <h2 className={classes.intro}>
                        Sign In to Polar
                    </h2>
                )}

                <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>

                    {/*<GoogleAuthButton/>*/}

                    <EmailTokenAuthButtonNotPhone/>

                    {/*<EmailAuthButton/>*/}

                </div>

            </div>

            <Divider className={classes.divider}/>

            {props.mode === 'create-account' && (
                <SignInWithExistingAccount/>
            )}

            {props.mode === 'sign-in' && (
                <OrCreateNewAccount/>
            )}

            <div style={{flexGrow: 1}}>

            </div>
                <Links/>
            </div>
        </DeviceRouters.NotPhone>

        <DeviceRouters.Phone>
            <div style={{height:"100vh"}}>
                <div style={{textAlign: 'center', marginTop: '100px'}}>
                    <div className={classes.logo}>
                        <PolarSVGIcon width={125} height={125}/>
                    </div>

                    <div>
                        <p className={classes.legal}>
                            Welcome to Polar
                        </p>
                    </div>
                </div>

                <div style={{display: 'block', position: 'absolute', bottom: '20px'}}>

                    <EmailTokenAuthButtonPhone/>

                    {props.mode === 'create-account' && (
                        <SignInWithExistingAccount/>
                    )}

                    {props.mode === 'sign-in' && (
                        <OrCreateNewAccount/>
                    )}

                    <div style={{flexGrow: 1}}>

                    </div>

                    <div>
                        <p style={{fontSize: '10px'}} className={classes.legal}>
                            You acknowledge that you will read, and agree to
                            our <a className={classes.linkDecoration} href="https://getpolarized.io/terms/">Terms of Service</a> and <a className={classes.linkDecoration} href="https://getpolarized.io/privacy-policy">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>

        </DeviceRouters.Phone>
        </>

    );
});

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

export const Authenticator = React.memo(function Authenticator(props: IProps) {

    const authStatus = useAuthHandler();

    return (
        <AuthenticatorModeContext.Provider value={props.mode}>
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
                                minHeight: '500px',
                                maxHeight: '800px',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>

                            <>

                                {authStatus === undefined && (
                                    <Pending/>
                                )}


                                {authStatus === 'needs-auth' && (
                                <Main {...props}/>
                                )}

                            </>

                        </Paper>

                    </div>
            </DeviceRouters.NotPhone>

            <DeviceRouters.Phone>
                    <>
                    {authStatus === undefined && (
                        <Pending/>
                    )}

                    {authStatus === 'needs-auth' && (
                    <Main {...props}/>
                    )}
                    </>
            </DeviceRouters.Phone>

                <Intercom/>
            </>
        </AuthenticatorModeContext.Provider>
    );
});
