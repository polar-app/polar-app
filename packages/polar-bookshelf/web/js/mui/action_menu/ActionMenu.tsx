import * as React from "react";
import List from "@material-ui/core/List";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {IActionMenuItem} from "./ActionStore";
import {MUICommandMenuItem} from "../command_menu/MUICommandMenuItem";
import {IDStr} from "polar-shared/src/util/Strings";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";


const useStyles = makeStyles((theme) =>
    createStyles({
        title: {
            padding: theme.spacing(1),
            color: theme.palette.text.hint,
            fontWeight: 'bold',
            fontSize: '1.0rem !important'
        },
        textField: {
            padding: theme.spacing(1),

            fontSize: '1.2rem !important'
        },
        item: {
            fontSize: '1.2rem !important'
        }

    }),
);

interface IProps {

    /**
     * Called when a command is to be executed.
     */
    readonly onAction: (id: IDStr) => void;

    /**
     * The actions the user can pick from.
     */
    readonly items: ReadonlyArray<IActionMenuItem>;

    /**
     * Called when the command menu should be closed.
     */
    readonly onClose: (reason: 'executed' | 'cancel') => void;

    readonly className?: string;

}

export const ActionMenu = React.memo(function ActionMenu(props: IProps) {

    const classes = useStyles();
    const {onAction, onClose, items} = props;

    const [index, setIndex] = React.useState<number | undefined>(undefined);

    const handleActionExecuted = React.useCallback((action: IActionMenuItem) => {

        onAction(action.id);
        onClose('executed');

    }, [onClose, onAction]);

    const handleIndexChange = React.useCallback((newIndex: number | undefined) => {

        if (newIndex !== index) {
            setIndex(newIndex);
        }

    }, [index]);

    type IndexDelta = -1 | 1;

    /**
     *
     * Handler so that we can handle up, down and escape and do so at the window
     * so that this component can take precedent over everything else.
     *
     */
    const handleKeyDownForCommandNavigation = React.useCallback((event: KeyboardEvent) => {

        // if (event.shiftKey || event.ctrlKey || event.metaKey) {
        //     // we only work with the raw keys.
        //     return;
        // }

        function abortEvent() {
            event.stopPropagation();
            event.preventDefault();
        }

        function computeNewIndex(delta: IndexDelta): number | undefined {

            if (index === undefined) {

                if (delta === 1) {
                    // go to the start
                    return 0;
                }

                if (delta === -1) {
                    // got to the end
                    return undefined;
                }

                return 0;

            }

            const newIndex = index + delta;

            if (newIndex < 0) {
                return undefined;
            }

            if (newIndex >= items.length) {
                return items.length - 1;
            }

            return newIndex;

        }

        function handleNewIndex(newIndex: number | undefined) {
            handleIndexChange(newIndex);
        }

        if (event.key === 'ArrowDown') {
            abortEvent();
            handleNewIndex(computeNewIndex(1));
        }

        if (event.key === 'ArrowUp') {
            abortEvent();
            handleNewIndex(computeNewIndex(-1));
        }

        if (event.key === 'Escape') {
            abortEvent();
            onClose('cancel');
        }

        // TODO: I don't think enter is handled?

        if (event.key === 'Tab') {
            if (index !== undefined) {
                const command = items[index];
                if (command) {
                    abortEvent();
                    handleActionExecuted(command);
                }
            }
        }

    }, [index, items, handleIndexChange, onClose, handleActionExecuted]);

    React.useEffect(() => {

        window.addEventListener('keydown', handleKeyDownForCommandNavigation, {capture: true});

        return () => {
            window.removeEventListener('keydown', handleKeyDownForCommandNavigation, {capture: true});
        }

    }, [handleKeyDownForCommandNavigation])

    const menuItems = items.map((item, idx) => {

        const selected = index === idx;
        const key = item.id + ':' + selected;

        return (
            <MUICommandMenuItem key={key}
                                className={classes.item}
                                text={item.text}
                                icon={item.icon}
                                selected={selected}
                                sequences={item.sequences}
                                onSelected={() => handleActionExecuted(item)}/>
        );
    });

    return (

        <ClickAwayListener onClickAway={() => props.onClose('cancel')}>
            <div style={{
                     display: 'flex',
                     flexDirection: 'column'
                 }}
                 className={props.className}>


                <List component="nav">
                    {items.length
                        ? menuItems
                        : (<MUICommandMenuItem
                            text="Search for a note"
                            onSelected={NULL_FUNCTION}
                        />)
                    }
                </List>
            </div>
        </ClickAwayListener>

    );

});
