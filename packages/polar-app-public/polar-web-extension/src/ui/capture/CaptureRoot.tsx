import React from 'react';
import {PreviewContent} from './PreviewContent';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {useCaptureContentContext} from './CaptureApp';
import {ReadabilityCapture} from "../../ReadabilityCapture";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import ICapturedContent = ReadabilityCapture.ICapturedContent;
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export const CaptureRoot = () => {

    const captureContentContext = useCaptureContentContext();

    const classes = useStyles();

    const [saving, setSaving]= React.useState(false);

    function saveToPolar(capture: ICapturedContent) {

        setSaving(true);

        const message = {
            type: 'save-to-polar',
            value: capture
        }

        chrome.runtime.sendMessage(message);

    }
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>

            <AppBar position="static" color="inherit">
                <Toolbar>

                    <Typography variant="h6" className={classes.title}>
                        Polar
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => saveToPolar(captureContentContext)}
                        startIcon={<CloudUploadIcon/>}>

                        Save to Polar

                    </Button>

                </Toolbar>
            </AppBar>

            {saving && <LinearProgress />}

            <div style={{display: 'flex'}}>
                <PreviewContent/>
            </div>

        </div>
    );
}
