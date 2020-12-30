import * as React from "react";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import {MUICommandMenuItem} from "./MUICommandMenuItem";
import {KeyBinding} from "../../keyboard_shortcuts/KeyboardShortcutsStore";
import {IDStr} from "polar-shared/src/util/Strings";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

/**
 * Provide a list of action items we should execute and provide a prompt to
 * filter the results such that the set of actions is applicable to the prompt.
 */
export type CommandsProvider = () => ReadonlyArray<ICommand>;

export interface ICommand {

    /**
     * A unique id for the action so that we can handle it on the callback.
     */
    readonly id: IDStr;

    /**
     * The text to show in the UI.
     */
    readonly text: string;

    /**
     * The group for the command, if any.
     */
    readonly group?: string;

    readonly icon?: React.ReactNode,

    readonly sequences?: ReadonlyArray<KeyBinding>;

    /**
     * Longer description of this command. Not just the shorter 'text' description.
     */
    readonly description?: string;

}

interface IProps {

    /**
     * The filter to use to narrow down the input.
     */
    readonly filter?: string;

    /**
     * Called when a command is to be executed.
     */
    readonly onCommand: (id: IDStr) => void;

    /**
     * Called when the command menu should be closed.
     */
    readonly onClose: (reason: 'executed' | 'cancel') => void;

    /**
     * A provider for resolving the items that the user can select form their input.
     */
    readonly commandsProvider: CommandsProvider;

}


export const MUICommandMenu = React.memo((props: IProps) => {

    const {commandsProvider, onCommand, onClose} = props;

    const [index, setIndex] = React.useState<number | undefined>();
    const [filter, setFilter] = React.useState<string | undefined>(props.filter);

    const commands = React.useMemo(() => commandsProvider(), [commandsProvider]);

    const filterPredicate = React.useCallback((command: ICommand) => {
        return filter === undefined || command.text.toLowerCase().indexOf(filter.toLowerCase()) !== -1
    }, [filter]);

    const commandsFiltered = React.useMemo(() => commands.filter(filterPredicate), [commands, filterPredicate]);

    const handleCommandExecuted = React.useCallback((id: IDStr) => {

        onCommand(id);
        onClose('executed');

    }, [onClose, onCommand]);

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
                    return commandsFiltered.length - 1;
                }

                return 0;

            }

            const newIndex = index + delta;

            if (newIndex < 0) {
                return commandsFiltered.length - 1;
            }

            if (newIndex >= commandsFiltered.length) {
                return 0;
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
                const command = commandsFiltered[index];
                handleCommandExecuted(command.id);
            }
        }

    }, [commandsFiltered, handleCommandExecuted, index, onClose]);

    React.useEffect(() => {

        window.addEventListener('keydown', handleKeyDownForCommandNavigation, {capture: true});

        return () => {
            window.removeEventListener('keydown', handleKeyDownForCommandNavigation, {capture: true});
        }

    })

    return (

        <ClickAwayListener onClickAway={() => props.onClose('cancel')}>
            <div style={{display: 'flex', flexDirection: 'column', width: '600px'}}>

                <TextField autoFocus={true}
                           onChange={event => setFilter(event.target.value) }/>

                <List component="nav">

                    {commandsFiltered.map((command, idx) => {

                        const selected = index === idx;
                        const key = (command.group || '') + ':' + command.text + ':' + selected;

                        return (
                            <MUICommandMenuItem key={key}
                                                text={command.text}
                                                icon={command.icon}
                                                selected={selected}
                                                sequences={command.sequences}
                                                onSelected={() => handleCommandExecuted(command.id)}/>
                        );
                    })}

                </List>
            </div>
        </ClickAwayListener>

    );

});