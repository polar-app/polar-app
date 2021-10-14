import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";

export const useStyles = makeStyles((theme) =>
    createStyles({
        legal: {
            margin: theme.spacing(1),
            marginTop: theme.spacing(5),
            marginBottom: theme.spacing(2),
            color: theme.palette.text.secondary,
            fontSize: '1.3em',
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
        linkDecoration: {
            color: theme.palette.text.secondary,
            textDecoration: 'underline !important'
        }
    }),
);


export const AuthLegalDisclaimer = () => {

    const classes = useStyles();

    return (
        <div>
            <p className={classes.legal}>
                You acknowledge that you will read, and agree to
                our <a className={classes.linkDecoration} href="https://getpolarized.io/terms/">Terms of Service</a> and <a className={classes.linkDecoration} href="https://getpolarized.io/privacy-policy">Privacy Policy</a>.
            </p>
        </div>
    );
}
