import React, {useEffect} from 'react';
import {Firebase} from "../../../../web/js/firebase/Firebase";
import {
    FirebaseUIAuth,
    FirebaseUIAuthOptions
} from "../../../../web/js/firebase/FirebaseUIAuth";
import {ExternalNavigationBlock} from "../../../../web/js/electron/navigation/ExternalNavigationBlock";
import Paper from '@material-ui/core/Paper';
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import {SignInSuccessURLs} from "./SignInSuccessURLs";
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import {ProviderURLs} from "./ProviderURLs";
import CircularProgress from '@material-ui/core/CircularProgress';



interface IProps extends FirebaseUIAuthOptions {

}

export const LoginScreen = React.memo(function LoginScreen(props: IProps) {

    const [pending, setPending] = React.useState(true);

    const doInit = React.useCallback(async () => {

        ExternalNavigationBlock.set(false);

        Firebase.init();

        const user = await Firebase.currentUserAsync();

        setPending(false);

        const signInSuccessUrl = SignInSuccessURLs.get();

        if (! user) {

            const providerURL = ProviderURLs.parse(document.location);

            const authOptions: FirebaseUIAuthOptions = {
                ...props,
                signInSuccessUrl,
                provider: providerURL.provider
            }

            FirebaseUIAuth.login(authOptions);

        } else {
            console.log("Already authenticated as " + user.email);
            document.location.href = signInSuccessUrl
        }

    }, [props]);

    useEffect(() => {
        doInit().catch(err => console.error(err));
    }, [doInit]);

    return (
        <div style={{
                 display: 'flex',
                 width: '100%',
                 height: '100%'
             }}>
            <Paper style={{
                       margin: 'auto',
                       maxWidth: '450px',
                       maxHeight: '500px',
                       width: '100%',
                       height: '100%',
                       display: 'flex',
                       flexDirection: 'column'
                   }}>

                <>
                    <div style={{flexGrow: 1}}>

                        <div className="text-center">

                            <PolarSVGIcon width={175} height={175}/>

                            <h1>
                                Login to Polar
                            </h1>

                        </div>

                        <div id="firebaseui-auth-container" className="p-1"/>

                        {pending && <CircularProgress/>}

                    </div>

                    <MUIButtonBar className="mt-1 p-1"
                                  style={{justifyContent: 'flex-end'}}>

                        {/*<Button variant="contained"*/}
                        {/*        color="default"*/}
                        {/*        onClick={doCancel}>*/}

                        {/*    Cancel*/}

                        {/*</Button>*/}

                        {/*<Button variant="contained"*/}
                        {/*        color="default"*/}
                        {/*        onClick={doDownloadDesktop}*/}
                        {/*        hidden={appRuntime === 'browser'}*/}
                        {/*        title="We also have a desktop version of Polar that runs on Windows, MacOS, or Linux.">*/}

                        {/*    <i className="fas fa-download"/>*/}

                        {/*    Download Desktop*/}

                        {/*</Button>*/}

                    </MUIButtonBar>
                </>

            </Paper>

        </div>
    );
});
