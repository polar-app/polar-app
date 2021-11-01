import * as React from "react";
import {deepMemo} from "../react/ReactUtils";
import {CommandsProvider, ICommandWithHandler} from "../mui/command_menu/MUICommandMenu";
import {MUICommandMenuKeyboardShortcut} from "../mui/command_menu/MUICommandMenuKeyboardShortcut";
import {
    GenericInputEvent,
    ShortcutEntry,
    useKeyboardShortcutsStore
} from "../keyboard_shortcuts/KeyboardShortcutsStore";
import {useJumpToNoteKeyboardCommands} from "../notes/JumpToNoteKeyboardCommand";
import {useJumpToDocumentKeyboardCommands} from "../notes/JumpToDocumentKeyboardCommand";

function useShortcuts() {
    const {shortcuts} = useKeyboardShortcutsStore(['shortcuts']);
    return Object.values(shortcuts);
}

export const ActiveKeyboardShortcuts2 = deepMemo(() => {

    const shortcuts = useShortcuts();

    type CommandType = 'keyboard-shortcut' | 'doc' | 'block';

    interface ICommandExtended extends ICommandWithHandler {
        readonly type: CommandType
    }

    const [noteCommandsProvider] = useJumpToNoteKeyboardCommands();
    const [documentCommandsProvider] = useJumpToDocumentKeyboardCommands();

    const commands = React.useMemo((): ReadonlyArray<ICommandExtended> => {

        function toKeyboardShortcutCommand(shortcut: ShortcutEntry, idx: number): ICommandExtended {

            const type = 'keyboard-shortcut';

            return {
                id: `${type}:${idx}`,
                type,
                text: shortcut.active.name,
                icon: shortcut.active.icon,
                description: shortcut.active.description,
                // group: shortcut.active.group,
                sequences: shortcut.active.sequences,
                handler: (event) => shortcut.active.handler(event)
            }
        }

        function toCommand(type: CommandType, current: ICommandWithHandler) {
            return {
                id: `${type}:${current.id}`,
                type,
                text: current.text,
                description: current.description,
                // group: 'Block',
                handler: current.handler
            }
        }

        function toDocCommand(current: ICommandWithHandler): ICommandExtended {
            return toCommand('doc', current);
        }

        function toNoteCommand(current: ICommandWithHandler): ICommandExtended {
            return toCommand('block', current);
        }

        const keyboardShortcutCommands = shortcuts.map(toKeyboardShortcutCommand);
        const docCommands = documentCommandsProvider().map(toDocCommand);
        const noteCommands = noteCommandsProvider().map(toNoteCommand);

        return [...keyboardShortcutCommands, ...docCommands, ...noteCommands];

    }, [shortcuts, documentCommandsProvider, noteCommandsProvider]);

    const commandsProvider: CommandsProvider<ICommandExtended> = React.useCallback((): ReadonlyArray<ICommandExtended> => {
        return commands;
    }, [commands]);

    const handleCommand = React.useCallback((command: ICommandExtended, event: GenericInputEvent) => {
        console.log("Executing handler for id: " + command.id);
        command.handler(event);
    }, []);

    return (
        <MUICommandMenuKeyboardShortcut group="Commands"
                                        name="Execute a command"
                                        description="Execute a command by name"
                                        sequences={[
                                            {
                                                keys: 'ctrl+k',
                                                platforms: ['linux', 'windows']
                                            },
                                            {
                                                keys: 'command+k',
                                                platforms: ['macos']
                                            }
                                        ]}
                                        onCommand={handleCommand}
                                        commandsProvider={commandsProvider}/>
    );

});


