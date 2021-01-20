import React from 'react';
import Paper from '@material-ui/core/Paper';
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import Button from '@material-ui/core/Button';
import {FAGoogleIcon} from "../../../../web/js/mui/MUIFontAwesome";
import EmailIcon from '@material-ui/icons/Email';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import firebase from 'firebase/app'
import {useLogger} from "../../../../web/js/mui/MUILogger";
import {FirebaseUIAuth} from "../../../../web/js/firebase/FirebaseUIAuth";
import {Firebase} from "../../../../web/js/firebase/Firebase";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import {SignInSuccessURLs} from "./SignInSuccessURLs";
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';

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
            fontSize: '2em'
        },

        divider: {
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
        }

    }),
);

const GoogleAuthButton = () => {

    const classes = useStyles();
    const [error, setError] = React.useState<string | undefined>();

    const triggerAuth = useTriggerFirebaseGoogleAuth();

    const doTriggerAuth = React.useCallback(async () => {

        setError(undefined);

        try {
            await triggerAuth();
        } catch (err) {
            setError(err.message)
        }

    }, [triggerAuth]);

    const handleTriggerAuth = React.useCallback(async () => {

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

            <Button variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleTriggerAuth}
                    startIcon={<FAGoogleIcon />}>

                Continue with Google

            </Button>
        </>
    );
}

type AuthStatus = 'needs-auth';

/**
 * The function we call AFTER the redirect has been completed to test if we're now authenticated.
 */
function useAuthHandler() {

    const logger = useLogger();
    const [status, setStatus] = React.useState<'needs-auth' |  undefined>();

    function handleAuthResult(authResult: firebase.auth.UserCredential) {

        if (authResult.additionalUserInfo?.isNewUser) {
            console.log("New user authenticated");
            Analytics.event2('new-user-signup');

            document.location.href = '/#welcome';

        } else {
            document.location.href = SignInSuccessURLs.get() || '/';
        }

    }

    async function handleEmailLink() {

        if (firebase.auth().isSignInWithEmailLink(window.location.href)) {

            const email = localStorage.getItem('emailForSignIn');

            // TODO: we need to be prompting for the user if they're attempting to login in
            // another browser session

            if (email) {
                const authResult = await firebase.auth().signInWithEmailLink(email, location.href);

                localStorage.removeItem('emailForSignIn');

                handleAuthResult(authResult);

            }

        }

    }

    async function doAsync(): Promise<AuthStatus | undefined> {

        const user = await Firebase.currentUserAsync()

        await handleEmailLink();

        if (user) {

            const auth = firebase.auth();

            const authResult = await auth.getRedirectResult();
            handleAuthResult(authResult);

        } else {
            setStatus('needs-auth');
        }

        return status;

    }

    doAsync()
        .catch(err => logger.error("Can not authenticate: ", err));

    return status;

}

function useTriggerFirebaseGoogleAuth() {

    /// https://firebase.google.com/docs/auth/web/google-signin

    return React.useCallback(async () => {

        const auth = firebase.auth();
        const provider = new firebase.auth.GoogleAuthProvider();

        provider.setCustomParameters({
            prompt: 'select_account'
        })

        await auth.signInWithRedirect(provider);

        FirebaseUIAuth.authWithGoogle();

    }, []);

}

function useTriggerFirebaseEmailAuth() {

    return React.useCallback(async (email: string) => {

        const auth = firebase.auth();

        await auth.sendSignInLinkToEmail(email, {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            // url: 'https://app.getpolarized.io',
            url: document.location.href,
            handleCodeInApp: true,
            dynamicLinkDomain: 'app.getpolarized.io'
        })

    }, []);

}

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
            setError(err.message);
        }

    }, [triggerFirebaseEmailAuth]);

    const handleAuth = React.useCallback(() => {

        doTriggerAuth(emailRef.current)
            .catch(err => console.log("Unable to handle auth: ", err));

    }, [doTriggerAuth])

    const handleKeyPress = React.useCallback((event: React.KeyboardEvent) => {

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
                    <Divider className={classes.divider}/>

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

            <Button variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleClick}
                    startIcon={<EmailIcon />}>

                Continue with Email

            </Button>
        </>
    );
};

const Main = React.memo((props: IProps) => {

    const classes = useStyles();

    return (
        <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>

            <div id="firebaseui-auth-container" style={{display: 'none'}}/>

            <div className="text-center">

                <div className={classes.logo}>
                    <PolarSVGIcon width={125} height={125}/>
                </div>

                <h2 className={classes.intro}>
                    Create your Polar Account
                </h2>

                <div style={{
                         display: 'flex',
                         flexDirection: 'column'
                     }}>

                    <GoogleAuthButton/>

                    <EmailAuthButton/>

                </div>

            </div>

            <Divider className={classes.divider}/>

            <div className={classes.alternate}>
                <Button>or sign-in with existing account</Button>
            </div>

            <div style={{flexGrow: 1}}>

            </div>

            <div>
                <p className={classes.legal}>
                    You acknowledge that you will read, and agree to
                    our <a href="https://getpolarized.io/terms/">Terms of Service</a> and <a href="https://getpolarized.io/privacy-policy">Privacy Policy</a>.
                </p>
            </div>


        </div>
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

interface IProps {
    readonly mode: 'create-account' | 'sign-in';
}

export const Authenticator = React.memo((props: IProps) => {

    const authStatus = useAuthHandler();

    return (
        <div style={{
                 display: 'flex',
                 width: '100%',
                 height: '100%'
             }}>

            <Paper style={{
                       margin: 'auto',
                       maxWidth: '450px',
                       minHeight: '500px',
                       maxHeight: '650px',
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
    );
});
