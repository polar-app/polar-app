import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Paper from '@material-ui/core/Paper';
import React from "react";
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

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
        email: {
            margin: theme.spacing(1),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
        },
        divider: {
            margin: theme.spacing(1),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
        },
    }),
);

export const BetaRegister = React.memo(function BetaRegister(props: {}) {
    const classes = useStyles();

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
                    <div className={classes.logo}>
                        <PolarSVGIcon width={125} height={125}/>
                    </div>

                    <h2 className={classes.intro}>
                        Join the waiting list
                    </h2>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <TextField autoFocus={true}
                                   className={classes.email}
                            // onChange={event => emailRef.current = event.target.value}
                            // onKeyPress={event => handleKeyPressEnter(event, handleEmailProvided)}
                                   placeholder="email@"
                                   variant="outlined"/>

                        <Divider className={classes.divider}/>

                        <Button variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() => {
                                    // FIXME: call the cloud function
                                }}>
                            Join
                        </Button>
                    </div>
                </div>
            </>

        </Paper>

    </div>;
})
