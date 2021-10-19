import { Link, Paper } from '@material-ui/core';
import * as React from 'react';
import {PolarSVGIcon} from "../../../web/js/ui/svg_icons/PolarSVGIcon";
import {Box, Typography} from '@material-ui/core';
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';
import { LogoAndTextSideBySide } from '../../repository/js/login/Authenticator';

const Infotext = () => {
    return (
        <div>
            <div style={{display: 'flex'}}>
                <div style={{marginRight: 'auto', marginLeft: 'auto', display: 'flex', alignItems: "center", flexDirection: 'column'}}>
                    <Box mt={6} ml={10} mr={10} textAlign={'center'}>
                        <Typography variant="body1">
                            <b>
                                Just a Minute
                            </b>
                        </Typography>
                    </Box>
                    <Box ml={10} mr={10} textAlign={'center'}>
                    <Typography variant="body1">
                        We're Migrating you to the latest version of Polar
                    </Typography>
                    </Box>
                </div>
            </div>
        </div>
    )
}

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

  const PolarMigrationEndInfo = () => {
    return (
        <div>
            <div style={{display: 'flex'}}>
                <div style={{marginRight: 'auto', marginLeft: 'auto', display: 'flex', alignItems: "center", flexDirection: 'column'}}>
                    <Typography variant="caption">
                        <Box mt={5} ml={6} mr={6} textAlign={'center'}>
                            As part of Polar's Updates, we're migrating the backend which can take up to a 
                            couple minutes, depending on the size of your repository. This is a one time migration. 
                            <Link> Learn More</Link>
                        </Box>
                    </Typography>
                </div>
            </div>
        </div>
    )
}

export const MigrationDialog = () => {

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
        <div style={{
            display: 'flex',
            width: '100%',
            height: '100%'
        }}>

            <Paper style={{
                margin: 'auto',
                maxWidth: '450px',
                minHeight: '550px',
                maxHeight: '750px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>

                <LogoAndTextSideBySide/>

                <Infotext/>

                <Box m={2}>
                    <LinearProgressWithLabel value={progress} />
                </Box>

                <PolarMigrationEndInfo/>

            </Paper>
        </div>
    );

};