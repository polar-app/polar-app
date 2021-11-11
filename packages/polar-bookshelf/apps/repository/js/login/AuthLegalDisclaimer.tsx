import { Box } from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { Link } from "react-router-dom";

export const useStyles = makeStyles((theme) =>
    createStyles({
        legal: {
            margin: theme.spacing(2),
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            color: theme.palette.text.secondary,
            fontSize: 10,
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
            our <LinkAnchor href="https://getpolarized.io/terms/" text={' Terms of Service '}/> 
            and <LinkAnchor href="https://getpolarized.io/privacy-policy" text={' Privacy Policy '}/> 
        </Box>
    );
}
interface LinkAnchorProps {
    readonly href: string;
    readonly text: string;
}

export const LinkAnchor = React.memo(function LinkAnchor(props: LinkAnchorProps){
    // const linkLoader = useLinkLoader();
    const classes = useStyles();

    return(
        <Link to={props.href} className={classes.linkDecoration}>
            {props.text}
        </Link>
    );
});
