import Paper from '@material-ui/core/Paper';
import React from "react";
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import {useStyles} from "./Authenticator";
import {JSONRPC} from "../../../../web/js/datastore/sharing/rpc/JSONRPC";
import {Box} from '@material-ui/core';
import {AuthLegalDisclaimer} from "./AuthLegalDisclaimer";

export const BetaRegister = React.memo(function BetaRegister(props: {}) {
    const classes = useStyles();

    const [isRegistered, setIsRegistered] = React.useState<boolean>(false);
    const emailRef = React.useRef("");

    return <div style={{
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
                <div className="text-center">
                    <Box margin={10}>
                        <PolarSVGIcon width={125} height={125}/>
                    </Box>

                    <h2>
                        Join the waiting list
                    </h2>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {isRegistered && <h2>
                            Thank you for registering!
                        </h2>}

                        {!isRegistered && <>
                            <TextField autoFocus={true}
                                       onChange={event => emailRef.current = event.target.value}
                                       placeholder="email@"
                                       variant="outlined"/>

                            <Divider/>

                            <Button variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={() => {
                                        // FIXME: call the cloud function
                                        const request = {
                                            email: emailRef.current.trim(),
                                            tag: "initial_signup",
                                        };
                                        JSONRPC.exec<unknown, any>('private-beta/register', request)
                                            .then((result: any) => {
                                                console.log(result);
                                                setIsRegistered(true);
                                            }).catch((reason: any) => console.error(reason));
                                    }}>
                                Join
                            </Button>
                        </>}

                    </div>

                    <AuthLegalDisclaimer/>

                </div>
            </>

        </Paper>

    </div>;
})
