import {Box, Button, LinearProgress, Typography} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import * as React from 'react';
import {LinearProgressWithLabel} from '../../ui/dialogs/LinearProgressWithLabel';
import {LogoAndTextSideBySide} from '../../../../apps/repository/js/login/Authenticator';
import Grid from '@material-ui/core/Grid';

interface IProps {
    readonly progress?: number;
    readonly onStart: () => void;
    readonly onSkip: () => void;
    readonly skippable: boolean;
    readonly started?: boolean;
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexGrow: 1,
            height: '100%',
        },
        progress: {
            flexGrow: 1,
        },
        buttonsHolder: {
            '& > * + *': {
                marginLeft: 16,
            },
        },
        textSection: {
            margin: '10px 0',
        },
    }),
);

export const MigrationToBlockAnnotationsMain = (props: IProps) => {

    const { progress, onStart, onSkip, skippable, started } = props;
    const classes = useStyles();

    return (
        <Grid item className={classes.root}>
            <Box m={2}
                 display="flex"
                 textAlign="center"
                 flexGrow={1}
                 alignItems="center"
                 justifyContent="space-between"
                 flexDirection="column">

                <Box m={2}>
                    <LogoAndTextSideBySide/>
                </Box>

                {started && (
                    <>
                        <Box>
                            <Typography variant="h5">
                                <b>
                                    Just a Moment
                                </b>
                            </Typography>
                            <Typography className={classes.textSection} variant="body1">
                                We're migrating you to the latest version of Polar
                            </Typography>
                            {! progress && (
                                <Typography variant="body1" className={classes.textSection}>
                                    Fetching required data... Please make sure you have a stable internet connection while the migration is running
                                </Typography>
                            )}
                            <Box my={2} display="flex" justifyContent="flex-start" style={{ width: '100%' }}>
                                {progress
                                    ? <LinearProgressWithLabel className={classes.progress} value={progress} />
                                    : <LinearProgress className={classes.progress} />}
                            </Box>

                        </Box>
                        <Typography variant="caption">
                            <Box m={2} textAlign="center" justifyContent="center">
                                As part of Polar's recent updates, we're migrating the backend which can take up to a
                                couple minutes, depending on the size of your repository. This is a one time migration.
                            </Box>
                        </Typography>
                    </>
                )}

                {! started && (
                    <>
                        <Box m={1}>
                            <Typography variant="h3" className={classes.textSection}>
                                Hello
                            </Typography>
                            <Typography variant="body1" className={classes.textSection}>
                                To be able to enjoy the latest features in polar
                                you need to migrate your data to the latest version.
                                <br />
                                <br />
                                This is a one-time migration.
                                <br />
                                <br />
                            </Typography>
                        </Box>
                        <div className={classes.buttonsHolder}>
                            {skippable && (
                                <Button variant="text"
                                        onClick={onSkip}>
                                    Skip for now
                                </Button>
                            )}
                            <Button color="primary"
                                variant="contained"
                                onClick={onStart}>
                                Start the migration
                            </Button>
                        </div>
                    </>
                )}
            </Box>
        </Grid>
    );
}
