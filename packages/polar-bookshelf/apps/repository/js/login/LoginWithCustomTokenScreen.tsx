import React, {useEffect} from 'react';
import {
    FirebaseUIAuth,
    FirebaseUIAuthOptions
} from "../../../../web/js/firebase/FirebaseUIAuth";
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button';
import {useLogger} from "../../../../web/js/mui/MUILogger";

interface IProps extends FirebaseUIAuthOptions {

}

function parseURL(): string | undefined {
    const url = new URL(document.location.href);
    return url.searchParams.get('token') || undefined;
}

export const LoginWithCustomTokenScreen = React.memo(function LoginWithCustomTokenScreen(props: IProps) {

    const customTokenRef = React.useRef("");
    const log = useLogger();

    const token = React.useMemo(() => parseURL(), []);

    const handleAuth = React.useCallback((customToken: string) => {

        async function doAsync() {
            await FirebaseUIAuth.loginWithCustomToken(customToken);
            document.location.href = '/';
        }

        doAsync().catch(err => log.error(err));

    }, [log]);


    if (token) {
        handleAuth(token);
        return null;
    }

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
                        <Button variant="contained" onClick={() => handleAuth(customTokenRef.current)}>
                            Auth with Custom Token
                        </Button>
                    </p>

                </div>

            </Paper>

        </div>
    );
});
