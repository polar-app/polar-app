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

function elementScrolledIntoView(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;

    console.log("FIXME: ", rect);

    // Only completely visible elements return true:
    const isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);

    // Partially visible elements return true:
    // isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}

function elementVisibleWithinContainer(el: HTMLElement, container: HTMLElement) {
    const eleTop = el.offsetTop;
    const eleBottom = eleTop + el.clientHeight;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    // The element is fully visible in the container
    return (
        (eleTop >= containerTop && eleBottom <= containerBottom) ||
        // Some part of the element is visible in the container
        (eleTop < containerTop && containerTop < eleBottom) ||
        (eleTop < containerBottom && containerBottom < eleBottom)
    );
}

function elementScrollParent(node: HTMLElement | null | undefined): HTMLElement | undefined {

    if (! node) {
        return undefined;
    }

    if (node.scrollHeight > node.clientHeight) {
        return node;
    } else {
        return elementScrollParent(node.parentElement);
    }
}

export const MUICommandMenuItem = React.memo(function MUICommandMenuItem(props: IProps) {

    const classes = useStyles();

    const elementRef = React.useRef<HTMLElement | null>(null);

    const handleClick = React.useCallback(() => {
        props.onSelected()
    }, [props])

    const doScroll = React.useCallback((element: HTMLElement, dir: 'up' | 'down') => {

        const opts = dir === 'up' ? {block: 'start'} : {block: 'end'}

        element.scrollIntoView(opts);

    }, [])

    React.useEffect(() => {

        if (props.selected) {
            if (elementRef.current) {

                if (! elementVisibleWithinContainer(elementRef.current, elementScrollParent(elementRef.current)!)) {
                    console.log("FIXME: scrolling into view... ")
                    elementRef.current.scrollIntoView();
                } else {
                    console.log("FIXME: NOT scrolling into view... ")
                }
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
