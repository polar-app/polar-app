import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import isEqual from "react-fast-compare";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from '@material-ui/icons/Close';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Slide from "@material-ui/core/Slide";
import {TransitionProps} from "@material-ui/core/transitions";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import PauseIcon from '@material-ui/icons/Pause';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
    readonly className?: string;
    readonly onSuspended?: () => void;
    readonly children: any;
}

export const ReviewerDialog = React.memo((props: IProps) => {

    // const createStyle = () => {
    //
    //     // again, hard, good, easy
    //
    //     const style: React.CSSProperties = {
    //         display: 'flex',
    //         flexDirection: 'column',
    //     };
    //
    //     if (['phone', 'tablet'].includes(Devices.get())) {
    //         style.width = '100%';
    //         style.height = '100%';
    //     } else {
    //         style.maxHeight = '1000px';
    //         style.width = '800px';
    //         style.maxWidth = '800px';
    //     }
    //
    //     return style;
    //
    // };

    // const style = createStyle();

    const [open, setOpen] = React.useState(true);
    const classes = useStyles();

    const handleClose = () => {
        const onSuspended = props.onSuspended || NULL_FUNCTION;
        onSuspended();
        setOpen(false);
    };

    return (
        <Dialog fullScreen open={open} TransitionComponent={Transition}>

            <>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Review
                        </Typography>
                        <IconButton  onClick={handleClose}>
                            <PauseIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {props.children}
            </>
        </Dialog>
    );

}, isEqual);
