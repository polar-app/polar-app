import {Button, CircularProgress, createStyles, LinearProgress, makeStyles} from "@material-ui/core";
import React from "react";
import {Interstitial as InterstitialType} from "./store/BlocksStore";
import CancelIcon from '@material-ui/icons/Cancel';

type IInterstitialProps = {
    interstitial: InterstitialType;
};

const useImageInterstitialStyles = makeStyles(() =>
    createStyles({
        root: {
            position: 'relative',
            overflow: 'hidden',
            display: 'inline-block',
        },
        image: {
            maxWidth: '100%',
            filter: 'grayscale(1) blur(3px)',
        },
        linearProgress: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
        },
        overlay: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        overlayInner: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', 
        }
    }),
);

const ImageInterstitial: React.FC<IInterstitialProps> = ({ interstitial }) => {
    const [progress, setProgress] = React.useState(0);
    const classes = useImageInterstitialStyles();

    React.useEffect(() => {
        interstitial.progressTracker.addListener((progress) => {
            setProgress(progress.value);
        });
    }, [interstitial]);

    const handleCancel = React.useCallback(() => {
        interstitial.controller.cancel();
    }, [interstitial]);

    return (
        <div className={classes.root}>
            <img src={interstitial.blobURL} className={classes.image} />
            <LinearProgress
                className={classes.linearProgress}
                variant="determinate"
                color="secondary"
                value={progress}
            />
            <div className={classes.overlay}>
                <div className={classes.overlayInner}>
                    <CircularProgress color="secondary" />
                    <Button
                        style={{ marginTop: 20 }}
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancel}
                        startIcon={<CancelIcon />}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
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
