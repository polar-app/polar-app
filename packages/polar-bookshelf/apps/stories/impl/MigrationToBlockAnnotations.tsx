import { Link, Paper } from '@material-ui/core';
import * as React from 'react';
import {Box, Typography} from '@material-ui/core';
import { IndeterminateProgressBar } from '../../../web/js/ui/progress_bar/IndeterminateProgressBar';
import { LogoAndTextSideBySide } from '../../repository/js/login/Authenticator';
import { AdaptiveDialog } from '../../../web/js/mui/AdaptiveDialog';

export const MigrationToBlockAnnotationsMainContent = () => {

    return (  
        <AdaptiveDialog>
                <Box m={2} display='flex' textAlign={'center'} flexGrow={1} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                    <Box m={2}>
                        <LogoAndTextSideBySide/>
                    </Box>
                    
                    <Typography variant="body1">
                        <b>
                            Just a Minute
                        </b>
                    </Typography>

                    <Typography variant="body1">
                        <Box m={1}>
                            We're Migrating you to the latest version of Polar
                        </Box>
                        <Box m={2}>
                            <IndeterminateProgressBar/>
                        </Box>
                    </Typography>
                        
                    <Typography variant="caption">
                        <Box m={2} textAlign={'center'} justifyContent={'center'}>
                            As part of Polar's Updates, we're migrating the backend which can take up to a 
                            couple minutes, depending on the size of your repository. This is a one time migration. 
                            <Link> Learn More</Link>
                        </Box>
                    </Typography>
                </Box>
        </AdaptiveDialog>
    )
}