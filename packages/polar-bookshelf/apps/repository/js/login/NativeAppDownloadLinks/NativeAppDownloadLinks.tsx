import {Link, Typography} from "@material-ui/core";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import appleDownloadLogo from './appstore.png';
import googleDownloadLogo from './googleplay.png';

const useStyles = makeStyles((theme) =>
    createStyles({
        padded: {
            margin: theme.spacing(1),
        },
        centered: {
            textAlign: 'center',
        }
    }),
);

export const NativeAppDownloadLinks = () => {
    const classes = useStyles();

    return <>
        <Typography variant="h6" component="div" align={"center"}>
            Already a user?
        </Typography>
        <Typography variant="body1" component="div" align={"center"} className={classes.padded}>
            Bring reading, note-taking and research on to your phone or tablet.
        </Typography>
        <p className={classes.centered}>
            <Link href="https://apps.apple.com/us/app/polar-the-learning-app/id1572700966" target={'_blank'}>
                <img src={appleDownloadLogo} alt="Download from Apple AppStore"/>
            </Link>

        </p>
        <p className={classes.centered}>
            <Link href="https://play.google.com/store/apps/details?id=io.getpolarized.polar" target={'_blank'}>
                <img src={googleDownloadLogo} alt="Download from Google Play Store"/>
            </Link>

        </p>
    </>
}
