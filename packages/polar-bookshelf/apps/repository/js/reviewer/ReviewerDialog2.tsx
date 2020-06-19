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
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";

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
    readonly open: boolean;
    readonly className?: string;
    readonly children: any;
    readonly onClose: () => void;
}

export const ReviewerDialog2 = React.memo((props: IProps) => {

    const classes = useStyles();

    return (
        <Dialog fullScreen open={props.open} TransitionComponent={Transition}>

            <>
                <AppBar className={classes.appBar}>
                    <Toolbar>

                        <PolarSVGIcon/>

                        <Typography variant="h6" className={classes.title}>
                            Review
                        </Typography>
                        {/*<IconButton  onClick={props.onClose}>*/}
                        {/*    <PauseIcon/>*/}
                        {/*</IconButton>*/}
                        <IconButton edge="start"
                                    color="inherit"
                                    onClick={props.onClose}
                                    aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {props.children}
            </>
        </Dialog>
    );

}, isEqual);
