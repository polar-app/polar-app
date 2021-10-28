import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import * as React from "react";
import {KeySequences} from "../../hotkeys/KeySequences";
import {MUIListItemRight} from "./MUIListItemRight";
import {KeyBinding} from "../../keyboard_shortcuts/KeyboardShortcutsStore";

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

interface IProps {

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
                console.log("FIXME: scrolling into view... ")
                elementRef.current?.scrollIntoView();
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

            {props.icon && (
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>)}

            {props.text}

            <MUIListItemRight>
                <>
                    {props.sequences && (
                        <KeySequences sequences={props.sequences}/>)}
                </>
            </MUIListItemRight>

        </ListItem>
    );

});
