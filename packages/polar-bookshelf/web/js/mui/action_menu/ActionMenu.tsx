import * as React from "react";
import List from "@material-ui/core/List";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {IActionMenuItem} from "./ActionStore";
import {MUICommandMenuItem} from "../command_menu/MUICommandMenuItem";
import {IDStr} from "polar-shared/src/util/Strings";


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

        function computeNewIndex(delta: number) {

            if (index === undefined) {

                if (delta === 1) {
                    // go to the start
                    return 0;
                }

                if (index === -1) {
                    // got to the end
                    return items.length - 1;
                }

                return 0;

            }

            const newIndex = index + delta;

            if (newIndex < 0) {
                // return commandsFiltered.length - 1;
                return 0;
            }

            if (newIndex >= items.length) {
                return items.length - 1;
            }

            return newIndex;

        }

        function handleNewIndex(delta: number) {
            const newIndex = computeNewIndex(delta);
            setIndex(newIndex);
        }

        if (event.key === 'ArrowDown') {
            abortEvent();
            handleNewIndex(1);
        }

        if (event.key === 'ArrowUp') {
            abortEvent();
            handleNewIndex(-1);
        }

        if (event.key === 'Escape') {
            abortEvent();
            onClose('cancel');
        }

        if (event.key === 'Enter') {
            abortEvent();
            if (index !== undefined) {
                const command = items[index];
                handleActionExecuted(command);
            }
        }

    }, [items, handleActionExecuted, index, onClose]);

    React.useEffect(() => {

        window.addEventListener('keydown', handleKeyDownForCommandNavigation, {capture: true});

        return () => {
            window.removeEventListener('keydown', handleKeyDownForCommandNavigation, {capture: true});
        }

    })

    return (

        <ClickAwayListener onClickAway={() => props.onClose('cancel')}>
            <div style={{
                     display: 'flex',
                     flexDirection: 'column'
                 }}
                 className={props.className}>


                <List component="nav">

                    {items.map((item, idx) => {

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
                    })}

                </List>
            </div>
        </ClickAwayListener>

    );

});
