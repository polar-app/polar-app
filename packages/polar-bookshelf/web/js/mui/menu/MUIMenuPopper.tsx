import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper, {PopperPlacementType} from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import isEqual from 'react-fast-compare';

const useStyles = makeStyles(() =>
    createStyles({
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
    readonly children: React.ReactElement;
    readonly placement?: PopperPlacementType;
    readonly open: boolean;
    readonly anchorRef: React.RefObject<HTMLElement>;
    readonly onClosed: () => void;
}

/**
 * Isolated and non-state based popper with the button external.
 */
export const MUIMenuPopper = React.memo(function MUIMenuPopper(props: IProps) {
    const classes = useStyles();

    const {anchorRef, onClosed} = props;

    const handleClose = React.useCallback((event: React.MouseEvent<EventTarget>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        onClosed();
    }, [anchorRef, onClosed]);

    const handleListKeyDown = React.useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            onClosed();
        }
    }, [onClosed]);

    const placement = props.placement || 'bottom';

    const id = props.id || 'dropdown';

    const menuListID = id + "-menu-list-grow";

    return (
        <Popper open={props.open}
                className={classes.popper}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                popperOptions={{
                    offsets: {
                        popper: {
                            top: 50
                        }
                    }
                }}
                placement={placement}
                disablePortal>

            {({ TransitionProps}) => (
                <Grow {...TransitionProps}>
                    <Paper elevation={10}
                           className={classes.paper}>
                        <ClickAwayListener onClickAway={handleClose}>

                            <MenuList autoFocusItem={props.open}
                                      id={menuListID}
                                      onClick={handleClose}
                                      onKeyDown={handleListKeyDown}>
                                {props.children}
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    );
}, isEqual);
