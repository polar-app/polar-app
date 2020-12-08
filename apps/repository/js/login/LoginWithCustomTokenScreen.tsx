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
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button';
import {useLogger} from "../../../../web/js/mui/MUILogger";

interface IProps extends FirebaseUIAuthOptions {

}

export const LoginWithCustomTokenScreen = React.memo((props: IProps) => {

    const customTokenRef = React.useRef("");
    const log = useLogger();

    const handleAuth = React.useCallback(() => {

        async function doAsync() {
            await FirebaseUIAuth.loginWithCustomToken(customTokenRef.current);
            document.location.href = '/';
        }

        doAsync().catch(err => log.error(err));

    }, []);

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


                <div>

                    <h2>Authenticate with Custom Token</h2>

                    <p>
                        <TextField label="Custom Token"
                                   value=""
                                   onChange={event => customTokenRef.current = event.target.value}/>
                    </p>


                    <p>
                        <Button variant="contained" onClick={handleAuth}>
                            Auth with Custom Token
                        </Button>
                    </p>

                </div>

            </Paper>

        </div>
    );
});
