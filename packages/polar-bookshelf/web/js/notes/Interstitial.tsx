import {Button, CircularProgress, createStyles, LinearProgress, makeStyles} from "@material-ui/core";
import React from "react";
import {Interstitial as InterstitialType} from "./store/BlocksStore";
import CancelIcon from '@material-ui/icons/Cancel';
import {MiddleDot} from "./MiddleDot";
import {NoteButton} from "./NoteButton";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {NOTES_GUTTER_SIZE} from "./Block";

type IInterstitialProps = {
    readonly interstitial: InterstitialType;
    readonly hasGutter?: boolean;
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
                color="primary"
                value={progress}
            />
            <div className={classes.overlay}>
                <div className={classes.overlayInner}>
                    <CircularProgress color="primary" />
                    <Button
                        style={{ marginTop: 20 }}
                        variant="outlined"
                        color="primary"
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
            display: 'flex',
            border: '3px solid transparent',
            paddingLeft: 2,
        },
        interstitialOuter: {
            marginLeft: 4,
        },
        actionsArea: {
            minWidth: 40,
            flex: '0 1 40px',
            display: 'flex',
            justifyContent: 'flex-end',
        }
    }),
);
export const Interstitial: React.FC<IInterstitialProps> = (props) => {
    const { interstitial, hasGutter = false } = props;
    const classes = useStyles();

    if (interstitial.type === 'image') {
        return (
            <div className={classes.root} style={{ marginLeft: hasGutter ? NOTES_GUTTER_SIZE : 0 }}>
                <div className={classes.actionsArea}>
                    <NoteButton onClick={NULL_FUNCTION}
                                style={{ fontSize: 20, width: 20, height: 20, display: 'block' }}>
                        <MiddleDot />
                    </NoteButton>
                </div>
                <div className={classes.interstitialOuter}>
                    <ImageInterstitial interstitial={interstitial} />
                </div>
            </div>
        );
    }
    return null;
};
