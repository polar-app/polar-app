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
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';
import {useAuthHandler, useTriggerFirebaseEmailAuth, useTriggerFirebaseGoogleAuth} from './AuthenticatorHooks';

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

const Main = React.memo((props: IProps) => {

    const classes = useStyles();

    return (
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

                    <GoogleAuthButton/>

                    <EmailAuthButton/>

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
