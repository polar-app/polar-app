import React from 'react';
import Paper from '@material-ui/core/Paper';
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import Button from '@material-ui/core/Button';
import EmailIcon from '@material-ui/icons/Email';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import createStyles from '@material-ui/core/styles/createStyles';
import {Box, Typography} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router-dom';
import {useAuthHandler, useTriggerStartTokenAuth, useTriggerVerifyTokenAuth} from './AuthenticatorHooks';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Analytics} from "../../../../web/js/analytics/Analytics";
import {Intercom} from "../../../../web/js/apps/repository/integrations/Intercom";
import {useStateRef} from '../../../../web/js/hooks/ReactHooks';
import {AuthLegalDisclaimer} from "./AuthLegalDisclaimer";

export const useStyles = makeStyles((theme) =>
    createStyles({

        button: {
            flexGrow: 1,
            margin: theme.spacing(1),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
            padding: '8px'
        },

        divider: {
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1)
        },

        sendLinkDivider: {
            margin: theme.spacing(1),
            marginBottom: theme.spacing(3),
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
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
            <DeviceRouters.Phone>
                <Button variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={props.onClick}
                        style={{width: '95vw', margin: '10px', textAlign: 'center'}}>

                    {hint} with {props.strategy}
                </Button>
            </DeviceRouters.Phone>

            <DeviceRouters.NotPhone>
                <Button variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={props.onClick}>
                    {hint} with {props.strategy}
                </Button>
            </DeviceRouters.NotPhone>
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

// Function to keep
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
            <DeviceRouters.Phone>
                <>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                    {active && (
                        <>
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
                                        style={{width: '95vw', textAlign: 'center', margin: '10px'}} />

                                    <div className={classes.alternate}>
                                        <Button onClick={handleEmailProvided}>Resend Email</Button>
                                    </div>

                                    <Button variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={handleClick}
                                        style={{width: '95vw', textAlign: 'center', margin: '10px'}}>
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
                                    style={{width: '95vw', textAlign: 'center', margin: '10px',  borderColor: '#6754D6 !important'}}
                                    InputProps={{
                                    startAdornment: (
                                            <EmailIcon style={{margin: '8px'}}/>
                                        )
                                    }}
                                />
                            )}
                        </>
                    )}

                    {!triggered && (
                        <AuthButton onClick={handleClick}
                            strategy="Email"
                            startIcon={<EmailIcon />}
                        />
                    )}
                </div>
                </>
            </DeviceRouters.Phone>

            <DeviceRouters.NotPhone>
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
                                    placeholder="Enter your email address"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                                <EmailIcon style={{margin: '8px'}}/>
                                            )
                                        }}
                                />
                            )}
                        </>
                    )}

                    {!triggered && (
                        <AuthButton onClick={handleClick}
                            strategy="Email"
                            startIcon={<EmailIcon />}
                        />
                    )}
                </>
            </DeviceRouters.NotPhone>
        </>
    );
};

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
                or create new account
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

const Main = React.memo(function Main(props: IProps) {
    const classes = useStyles();

    return (
        <>
            <div style={{
                     height:"100vh",
                     textAlign: 'center',
                     flexGrow: 1,
                     display: 'flex',
                     flexDirection: 'column'
                 }}>

                <Box marginTop={1}>
                    {props.mode === 'create-account' && (
                        <>
                            <LogoAndTextSideBySide/>

                            <h2>
                                Join The Waiting List
                            </h2>

                            <Divider className={classes.sendLinkDivider}/>

                            <FlexLayoutForm/>
                        </>
                    )}

                    {props.mode === 'sign-in' && (
                        <>
                        <Box margin={10}>
                            <PolarSVGIcon width={125} height={125}/>
                        </Box>
                        <h2>
                            Sign In to Polar
                        </h2>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column'
                            }}>
                            <EmailTokenAuthButton/>
                        </div>

                        <Divider className={classes.divider}/>
                    </>
                    )}
                </Box>

                {props.mode === 'create-account' && (
                    <SignInWithExistingAccountButton/>
                )}

                {props.mode === 'sign-in' && (
                    <OrCreateNewAccountButton/>
                )}

                <div style={{flexGrow: 1}}/>

                <AuthLegalDisclaimer/>

            </div>
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
                               minHeight: '500px',
                               maxHeight: '800px',
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

export const Authenticator = React.memo(function Authenticator(props: IProps) {

    const authStatus = useAuthHandler();

    return (
        <AuthenticatorModeContext.Provider value={props.mode}>
            <AdaptiveDialog>
                <>

                    {authStatus === undefined && (
                        <Pending/>
                    )}

                    {authStatus === 'needs-auth' && (
                        <Main {...props}/>
                    )}

                    <Intercom/>

                </>

            </AdaptiveDialog>
        </AuthenticatorModeContext.Provider>
    );
});
