import {useHistory} from "react-router-dom";
import React from "react";
import SpeedDial from "@material-ui/lab/SpeedDial";
import RateReviewIcon from "@material-ui/icons/RateReview";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
     createStyles({
          root: {
              height: 380,
              transform: 'translateZ(0px)',
              flexGrow: 1,
          },
          speedDial: {
              position: 'absolute',
              bottom: theme.spacing(8),
              right: theme.spacing(2),
          },
      }),
);

export function StartReviewSpeedDial() {

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
                title="Reading"
                tooltipTitle="Reading"
                tooltipOpen
                color="secondary"
                onClick={handleReading}/>

            <SpeedDialAction
                icon={<FlashOnIcon/>}
                title="Flashcards"
                tooltipTitle="Flashcards"
                tooltipOpen
                color="secondary"
                onClick={handleFlashcards}/>

        </SpeedDial>
    );
}
