import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import * as React from "react";
import {KeySequences} from "../../hotkeys/KeySequences";
import {KeyBinding} from "../../keyboard_shortcuts/KeyboardShortcutsStore";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const useStyles = makeStyles((theme) =>
    createStyles({

        root: {
            padding: theme.spacing(1),

            borderLeftWidth: '3px',
            borderLeftStyle: 'solid',
            borderLeftColor: 'transparent',

        },
        selected: {
            borderLeftWidth: '3px',
            borderLeftStyle: 'solid',
            borderLeftColor: theme.palette.secondary.dark,
        },

    }),
);

export interface IMUICommandMenuItemBaseProps {

    /**
     * When true, we enable icons to the left. This way we require every action
     * to have an icon but only if enabled.
     */
    readonly enableIcons?: boolean;

    /**
     * When true, we show the keyboard shortcuts to the right.  This has to be
     * enabled as a hint so that every item is given an empty block if there are
     * no shortcuts.
     */
    readonly enableKeyboardShortcuts?: boolean;

}

interface IProps extends Required<IMUICommandMenuItemBaseProps> {

    readonly icon?: React.ReactNode;

    readonly text: string;

    /**
     * True if this items should be shown as selected.
     */
    readonly selected?: boolean;

    readonly sequences?: ReadonlyArray<KeyBinding>;

    readonly onSelected: () => void;

    readonly className?: string;

}

export const MUICommandMenuItem = React.memo(function MUICommandMenuItem(props: IProps) {

    const classes = useStyles();

    const elementRef = React.useRef<HTMLElement | null>(null);

    const handleClick = React.useCallback(() => {
        props.onSelected()
    }, [props])

    React.useEffect(() => {

        if (props.selected) {
            if (elementRef.current) {
                elementRef.current?.scrollIntoView({block: 'nearest'});
            }
        }

    }, [props.selected]);

    return (
        <ListItem disableGutters
                  ref={ref => elementRef.current = ref}
                  button
                  className={clsx(props.className, classes.root, props.selected && classes.selected)}
                  selected={props.selected}
                  onClick={handleClick}>

            {props.enableIcons && props.icon && (
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>)}

            {props.text}

            {props.enableKeyboardShortcuts && (
                <ListItemSecondaryAction>
                    <>
                        {props.sequences && (
                            <KeySequences sequences={props.sequences}/>)}
                    </>
                </ListItemSecondaryAction>
            )}

        </ListItem>
    );

});
