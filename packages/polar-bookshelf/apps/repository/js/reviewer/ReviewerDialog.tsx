import * as React from "react";
import isEqual from "react-fast-compare";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from "@material-ui/core/Toolbar";
import Slide from "@material-ui/core/Slide";
import {TransitionProps} from "@material-ui/core/transitions";
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Dialog from "@material-ui/core/Dialog";

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
    readonly children: any;
    readonly onClose: () => void;
}

export const ReviewerDialog = React.memo(function ReviewerDialog(props: IProps) {

    const classes = useStyles();

    return (
        <Dialog fullScreen open
                TransitionComponent={Transition}>

            <>
                <AppBar className={classes.appBar}
                        color="inherit">
                    <Toolbar>

                        <PolarSVGIcon width={64} height={64}/>

                        <Typography variant="h6" className={classes.title}>
                            Review
                        </Typography>
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
