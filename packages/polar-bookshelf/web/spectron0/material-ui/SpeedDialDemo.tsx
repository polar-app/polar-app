import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import RateReviewIcon from "@material-ui/icons/RateReview";
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme: Theme) =>
     createStyles({
          root: {
              height: 380,
              transform: 'translateZ(0px)',
              flexGrow: 1,
          },
          speedDial: {
              position: 'absolute',
              bottom: theme.spacing(2),
              right: theme.spacing(2),
          },
      }),
);

export function SpeedDialDemo() {

    const history = useHistory();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [hidden, setHidden] = React.useState(false);

    function handleReading() {
        handleClose();
        history.push({pathname: '/annotations', hash: '#review-reading'});
    }

    function handleFlashcards() {
        handleClose();
        history.push({pathname: '/annotations', hash: '#review-flashcards'});
    }

    const handleVisibility = () => {
        setHidden((prevHidden) => !prevHidden);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Button onClick={handleVisibility}>Toggle Speed Dial</Button>
            <Backdrop open={open} />
            <SpeedDial
                ariaLabel="Start Review"
                className={classes.speedDial}
                hidden={hidden}
                icon={ <RateReviewIcon/>}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
            >

                <SpeedDialAction
                    icon={<LocalLibraryIcon/>}
                    tooltipTitle="Reading"
                    tooltipOpen
                    onClick={handleReading}/>

                <SpeedDialAction
                    icon={<FlashOnIcon/>}
                    tooltipTitle="Flashcards"
                    tooltipOpen
                    onClick={handleFlashcards}/>

            </SpeedDial>
        </div>
    );
}
