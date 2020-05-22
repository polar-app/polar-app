import React from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper, {PopperPlacementType} from '@material-ui/core/Popper';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import IconButton from "@material-ui/core/IconButton";
import {MUIDropdownCaret} from "../MUIDropdownCaret";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            zIndex: 1000
        },
        popper: {
            zIndex: 1000
        },
        paper: {
            // marginRight: theme.spacing(2),
            // marginTop: theme.spacing(1),
            marginTop: '2px'
        },
    }),
);


interface IProps {
    readonly id?: string;

    readonly onClick?: (event: React.MouseEvent<EventTarget>) => void;
    readonly variant?: "contained";
    readonly icon?: JSX.Element;
    readonly text?: string;
    readonly color?: 'primary' | 'secondary' | 'default'
    readonly size?: 'small' | 'medium' | 'large';
    readonly ref?: React.RefObject<HTMLButtonElement>;
    readonly style?: React.CSSProperties;

    readonly caret?: boolean;
    readonly placement?: PopperPlacementType;

    readonly children: JSX.Element;

}

export const MUIPopper = (props: IProps) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<EventTarget>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);

    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const buttonProps = {
        onClick: handleToggle || NULL_FUNCTION,
        color: props.color,
        size: props.size,
        ref: anchorRef,
    };

    const placement = props.placement || 'bottom';

    const id = props.id || 'dropdown';

    return (
        <div className={classes.root}>
            <div>

                {props.text && props.icon &&
                    <Button {...buttonProps}
                            startIcon={props.icon}
                            endIcon={props.caret ? <MUIDropdownCaret/> : undefined}
                            variant="contained">
                        {props.text}
                    </Button>}

                {props.icon && ! props.text &&
                    <IconButton {...buttonProps}
                                size={buttonProps.size === 'large' ? 'medium' : buttonProps.size}>
                        {props.icon}
                    </IconButton>}

                {! props.icon && props.text &&
                    <Button {...buttonProps} size="large" variant="contained">
                        {props.text}
                    </Button>}

                <Popper open={open}
                        className={classes.popper}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        popperOptions={{
                            offsets: {
                                popper: {
                                    top: 10
                                }
                            }
                        }}
                        placement={placement}
                        disablePortal>

                    {({ TransitionProps, placement }) => (
                        <Grow {...TransitionProps}>
                            <Paper elevation={10}
                                   className={classes.paper}>
                                <ClickAwayListener onClickAway={handleClose}>
                                    {props.children}
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    );
}
