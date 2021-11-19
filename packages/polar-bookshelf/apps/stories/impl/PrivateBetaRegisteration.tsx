import React from "react";
import {createStyles, makeStyles} from '@material-ui/core/styles';
import { TextField, Box, Button, LinearProgress } from "@material-ui/core";
import {Email as EmailIcon, VpnKey as VpnKeyIcon} from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { AdaptiveDialog } from "../../../web/js/mui/AdaptiveDialog";

export const useStyles = makeStyles((theme) =>
    createStyles({
        alert: {
            margin: theme.spacing(1),
        },
        email: {
            flexGrow: 1,
            margin: theme.spacing(1),
        },
    })
);
export const RegisterForBetaPending = () => {
    return <PBEmailAndReferral pending email={'example@getpolarized.io'} referral={'123123'}/>;
}

export const RegisterForBetaError = () => {
    return <PBEmailAndReferral alert email={'example@22'} />;
}

export const PBEmailAndReferral = (props: { alert?:boolean, pending?:boolean, email?: string, referral?: string }) => {

    const classes = useStyles();
    const [pending, setPending] = React.useState(props.pending || false);
    const [alert, setAlert] = React.useState(props.alert || false);

    const emailRef = React.useRef(props.email || "");
    const codeRef = React.useRef(props.referral || "");

    return(
        <AdaptiveDialog>
            <Box component={'h5'} display={'flex'} justifyContent={'center'}>
                    Join the waiting list
            </Box>            
            
            {pending && <Box component='div' px={3}>
                <LinearProgress/>
            </Box>}

            {alert && <Alert severity={'error'} 
                    className={classes.alert}>
                {'Unable to register email: The email address is improperly formatted.'}
            </Alert>}

            <Box component='div' px={2} style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                <TextField  autoFocus={true}
                            className={classes.email}
                            onChange={event => emailRef.current = event.target.value}
                            placeholder="Enter your email address"
                            defaultValue={emailRef.current}
                            InputProps={{
                                startAdornment: (
                                    <EmailIcon style={{margin: '8px'}}/>
                                )
                            }}
                            variant="outlined"/>

                <TextField  className={classes.email}
                            onChange={event => codeRef.current = event.target.value}
                            placeholder="Referral code (optional)"
                            defaultValue={codeRef.current}
                            InputProps={{
                                startAdornment: (
                                    <VpnKeyIcon style={{margin: '8px'}}/>
                                )}}
                            variant="outlined"/>

                <Button variant="contained"
                        size="large"
                        color="primary"
                        className={classes.button}>
                    Join
                </Button>
            </Box>
        </AdaptiveDialog>
    );
}