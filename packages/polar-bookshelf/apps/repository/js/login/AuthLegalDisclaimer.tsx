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
            textAlign: 'center',
        }
    }),
);


export const AuthLegalDisclaimer = () => {

    const classes = useStyles();

    return (
        <Box component='small' className={classes.legal}>
            You acknowledge that you will read, and agree to
            our <MUIAnchor href="https://getpolarized.io/terms/"> Terms of Service </MUIAnchor> 
            and <MUIAnchor href="https://getpolarized.io/privacy-policy"> Privacy Policy </MUIAnchor> 
        </Box>
    );
}