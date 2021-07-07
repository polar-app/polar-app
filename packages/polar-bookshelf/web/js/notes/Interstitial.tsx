import {CircularProgress, createStyles, makeStyles} from "@material-ui/core";
import React from "react";
import {Interstitial as InterstitialType} from "./store/BlocksStore";

type IInterstitialProps = {
    interstitial: InterstitialType;
};

const ImageInterstitial: React.FC<IInterstitialProps> = ({ interstitial }) => {
    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
                src={interstitial.blobURL}
                style={{
                    maxWidth: '100%',
                    filter: 'grayscale(1)',
                }}
            />
            <CircularProgress
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0, 
                    bottom: 0,
                    margin: 'auto',
                    width: 60,
                    height: 60,
                }}
            />
        </div>
    );
};

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginLeft: '3rem',
            '&:not(:first-child)': {
                marginTop: 16
            }
        },
    }),
);
export const Interstitial: React.FC<IInterstitialProps> = ({ interstitial }) => {
    const classes = useStyles();

    if (interstitial.type === 'image') {
        return (
            <div className={classes.root}>
                <ImageInterstitial interstitial={interstitial} />
            </div>
        );
    }
    return null;
};
