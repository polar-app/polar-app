import { Box } from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { MUIAnchor } from "../../../../web/js/mui/MUIAnchor";

export const useStyles = makeStyles((theme) =>
    createStyles({
        legal: {
            margin: theme.spacing(2),
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            color: theme.palette.text.secondary,
            fontSize: 12,
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
            color: theme.palette.primary.main + '!important'        }
    }),
);


export const AuthLegalDisclaimer = () => {

    const classes = useStyles();

    return (
        <Box component='p' className={classes.legal}>
            You acknowledge that you will read, and agree to
            our <MUIAnchor href="https://getpolarized.io/terms/" className={classes.linkDecoration}> Terms of Service </MUIAnchor> 
            and <MUIAnchor href="https://getpolarized.io/privacy-policy" className={classes.linkDecoration}> Privacy Policy </MUIAnchor> 
        </Box>
    );
}