import { Link, Paper } from '@material-ui/core';
import * as React from 'react';
import {PolarSVGIcon} from "../../../web/js/ui/svg_icons/PolarSVGIcon";
import {Box, Typography} from '@material-ui/core';
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';
import { LogoAndTextSideBySide } from '../../repository/js/login/Authenticator';
import { AdaptiveDialog } from '../../../web/js/mui/AdaptiveDialog';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <>
            <Box mt={5} display="flex" alignItems="center" flexDirection="column">
                <Box width="100%">
                    <LinearProgress variant="determinate" {...props} />
                </Box>
            
            </Box>
            <Box m={1}>
                <Typography variant="caption" color="textSecondary" gutterBottom>{`${Math.round(
                    props.value,
                    )}%`}
                </Typography>
            </Box>
        </>
    );
  }

const Infotext = () => {

    const [progress, setProgress] = React.useState(10);
  
    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
      }, 800);
      return () => {
        clearInterval(timer);
      };
    }, []);

    return (  
        <AdaptiveDialog>
                <Box display='flex' flexGrow={1} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                    <Typography variant="body1">
                        <b>
                            Just a Minute
                        </b>
                    </Typography>

                    <Typography variant="body1">
                        We're Migrating you to the latest version of Polar
                        
                        <LinearProgressWithLabel value={progress} />
                    </Typography>

                        
                    
                    <Typography variant="caption">
                        <Box mt={5} ml={6} mr={6} textAlign={'center'}>
                            As part of Polar's Updates, we're migrating the backend which can take up to a 
                            couple minutes, depending on the size of your repository. This is a one time migration. 
                            <Link> Learn More</Link>
                        </Box>
                    </Typography>
                </Box>
        </AdaptiveDialog>
    )
}

export const MigrationDialog = () => {

    return (

            <AdaptiveDialog>
                <Paper>
                        <Box mt={2}>
                            <LogoAndTextSideBySide/>
                        </Box>
                        
                        <Box>
                            <Infotext/>
                        </Box>
                </Paper>
            </AdaptiveDialog>
    );

};