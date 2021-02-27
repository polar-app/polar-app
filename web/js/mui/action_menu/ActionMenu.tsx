import * as React from "react";
import List from "@material-ui/core/List";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {IActionMenuItem} from "./ActionStore";
import {MUICommandMenuItem} from "../command_menu/MUICommandMenuItem";
import {ActionHandler} from "./UseActions";


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
    readonly onAction: ActionHandler;

    /**
     * The actions the user can pick from.
     */
    readonly actions: ReadonlyArray<IActionMenuItem>;

    /**
     * Called when the command menu should be closed.
     */
    readonly onClose: (reason: 'executed' | 'cancel') => void;

    readonly className?: string;

}

export const ActionMenu = React.memo((props: IProps) => {

    const classes = useStyles();
    const {onAction, onClose, actions} = props;

    const [index, setIndex] = React.useState<number>(0);

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

        function stopHandlingEvent() {
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
                    return actions.length - 1;
                }

                return 0;

            }

            const newIndex = index + delta;

            if (newIndex < 0) {
                // return commandsFiltered.length - 1;
                return 0;
            }

            if (newIndex >= actions.length) {
                return actions.length - 1;
            }

            return newIndex;

        }

        function handleNewIndex(delta: number) {
            const newIndex = computeNewIndex(delta);
            setIndex(newIndex);
        }

        if (event.key === 'ArrowDown') {
            stopHandlingEvent();
            handleNewIndex(1);
        }

        if (event.key === 'ArrowUp') {
            stopHandlingEvent();
            handleNewIndex(-1);
        }

        if (event.key === 'Escape') {
            stopHandlingEvent();
            onClose('cancel');
        }

        if (event.key === 'Enter') {
            stopHandlingEvent();
            if (index !== undefined) {
                const command = actions[index];
                handleActionExecuted(command);
            }
        }

    }, [actions, handleActionExecuted, index, onClose]);

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

                    {actions.map((action, idx) => {

                        const selected = index === idx;
                        const key = action.id + ':' + selected;

                        return (
                            <MUICommandMenuItem key={key}
                                                className={classes.item}
                                                text={action.text}
                                                icon={action.icon}
                                                selected={selected}
                                                sequences={action.sequences}
                                                onSelected={() => handleActionExecuted(action)}/>
                        );
                    })}

                </List>
            </div>
        </ClickAwayListener>

    );

});
