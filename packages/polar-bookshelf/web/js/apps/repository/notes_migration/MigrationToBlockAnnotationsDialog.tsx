import {Box, Button, LinearProgress, Typography} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import * as React from 'react';
import {LinearProgressWithLabel} from '../../../ui/dialogs/LinearProgressWithLabel';
import {LogoAndTextSideBySide} from '../../../../../apps/repository/js/login/Authenticator';
import Grid from '@material-ui/core/Grid';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';

interface IProps {
    readonly progress?: number;
    readonly onStart?: () => void;
    readonly onSkip?: () => void;
    readonly skippable?: boolean;
    readonly started?: boolean;
}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexGrow: 1,
            height: '100%',
            padding: `${theme.spacing(2)}px ${theme.spacing(8)}px`,
        },
        progress: {
            flexGrow: 1,
        },
        textSection: {
            marginBottom: theme.spacing(4),
        },
        buttonsHolder: {
            width: '100%',
            marginBottom: theme.spacing(3),

            '& > * + *': {
                marginTop: theme.spacing(1),
            },
        },
    }),
);

export const MigrationToBlockAnnotationsDialog = (props: IProps) => {

    const {
        progress,
        onStart = NULL_FUNCTION,
        onSkip = NULL_FUNCTION,
        skippable = false,
        started,
    } = props;
    const classes = useStyles();

    return (
        <Grid item className={classes.root}>
            <Box my={2}
                 display="flex"
                 textAlign="center"
                 flexGrow={1}
                 alignItems="center"
                 flexDirection="column">

                <Box mb={2}>
                    <LogoAndTextSideBySide/>
                </Box>

                {started && (
                    <>
                        <Typography variant="h5" className={classes.textSection}>
                            <b>New features on the way</b>
                        </Typography>

                        <Box display="flex"
                             mb={6}
                             justifyContent="flex-start"
                             style={{ width: '100%' }}>
                            {progress
                                ? <LinearProgressWithLabel className={classes.progress} value={progress} />
                                : <LinearProgress className={classes.progress} />}
                        </Box>

                        <Typography variant="subtitle1" className={classes.textSection}>
                            We're migrating you to the latest version  of Polar. which can take up to 20 minutes, depending on the size of your library.
                        </Typography>
                    </>
                )}

                {! started && (
                    <>
                        <Typography variant="h5" className={classes.textSection}>
                            <b>It's time to level up</b>
                        </Typography>

                        <div className={classes.buttonsHolder}>
                            <Button color="primary"
                                    fullWidth
                                    variant="contained"
                                    onClick={onStart}>
                                Level up now
                            </Button>

                            {skippable && (
                                <Button variant="text"
                                        fullWidth
                                        onClick={onSkip}>
                                    Skip
                                </Button>
                            )}
                        </div>

                        <Typography variant="subtitle1" className={classes.textSection}>
                            We're rolling out new features, in order to use them we need to move your library to our latest version. This may take up to 20 minutes, depending on the size of your library.
                        </Typography>
                    </>
                )}

                <Typography variant="caption">
                    This is a one time migration
                </Typography>
            </Box>
        </Grid>
    );
}
