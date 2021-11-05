import {Box, LinearProgress, Typography} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import * as React from 'react';
import {LinearProgressWithLabel} from '../../ui/dialogs/LinearProgressWithLabel';
import {LogoAndTextSideBySide} from '../../../../apps/repository/js/login/Authenticator';
import Grid from '@material-ui/core/Grid';

interface IProps {
    readonly progress?: number;
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexGrow: 1,
        },
        progress: {
            flexGrow: 1,
        }
    }),
);

export const MigrationToBlockAnnotationsMain = (props: IProps) => {

    const {progress} = props;
    const classes = useStyles();

    return (
        <Grid item className={classes.root}>
            <Box m={2}
                 display="flex"
                 textAlign="center"
                 flexGrow={1}
                 alignItems="center"
                 justifyContent="center"
                 flexDirection="column">

                <Box m={2}>
                    <LogoAndTextSideBySide/>
                </Box>

                <Typography variant="body1">
                    <b>
                        Just a Moment
                    </b>
                </Typography>

                <Box m={1}>
                    <Typography variant="body1">
                        We're migrating you to the latest version of Polar
                    </Typography>
                </Box>
                <Box m={2}>
                    {! progress && (
                        <Typography variant="body1">
                            Fetching required data... Please make sure you have a stable internet connection when performing the migration
                        </Typography>
                    )}
                </Box>
                <Box display="flex" justifyContent="flex-start" style={{ width: '100%' }}>
                    {progress
                        ? <LinearProgressWithLabel className={classes.progress} value={progress} />
                        : <LinearProgress className={classes.progress} />}
                </Box>

                <Typography variant="caption">
                    <Box m={2} textAlign={'center'} justifyContent={'center'}>
                        As part of Polar's recent updates, we're migrating the backend which can take up to a
                        couple minutes, depending on the size of your repository. This is a one time migration.
                        {/*<Link> Learn More</Link>*/}
                    </Box>
                </Typography>
            </Box>
        </Grid>
    )
}
