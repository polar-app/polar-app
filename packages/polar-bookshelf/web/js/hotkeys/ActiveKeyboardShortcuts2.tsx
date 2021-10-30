import * as React from "react";
import {deepMemo} from "../react/ReactUtils";
import {CommandsProvider, ICommandWithHandler} from "../mui/command_menu/MUICommandMenu";
import {MUICommandMenuKeyboardShortcut} from "../mui/command_menu/MUICommandMenuKeyboardShortcut";
import {
    GenericInputEvent,
    ShortcutEntry,
    useKeyboardShortcutsStore
} from "../keyboard_shortcuts/KeyboardShortcutsStore";
import {useDocRepoStore} from "../../../apps/repository/js/doc_repo/DocRepoStore2";
import {RepoDocInfo} from "../../../apps/repository/js/RepoDocInfo";
import {useNamedBlocks} from "../notes/NoteUtils";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useJumpToNoteKeyboardCommands} from "../notes/JumpToNoteKeyboardCommand";

function useDocInfos() {
    const {data} = useDocRepoStore(['data']);
    return data;
}

function useShortcuts() {
    const {shortcuts} = useKeyboardShortcutsStore(['shortcuts']);
    return Object.values(shortcuts);
}

export const ActiveKeyboardShortcuts2 = deepMemo(() => {

    const shortcuts = useShortcuts();
    const docInfos = useDocInfos();
    const blocks = useNamedBlocks({ sort : false });

    interface ICommandExtended extends ICommandWithHandler {
        readonly type: 'keyboard-shortcut' | 'doc' | 'block';
    }

    const [noteCommandsProvider] = useJumpToNoteKeyboardCommands();

    const commands = React.useMemo((): ReadonlyArray<ICommandExtended> => {

        function toKeyboardShortcutCommand(shortcut: ShortcutEntry, idx: number): ICommandExtended {

            const type = 'keyboard-shortcut';

            return {
                id: `${type}:${idx}`,
                type,
                text: shortcut.active.name,
                icon: shortcut.active.icon,
                description: shortcut.active.description,
                group: shortcut.active.group,
                sequences: shortcut.active.sequences,
                handler: (event) => shortcut.active.handler(event)
            }
        }

        function toDocCommand(repoDocInfo: RepoDocInfo): ICommandExtended {

            const type = 'doc';

            return {
                id: `${type}:${repoDocInfo.id}`,
                type,
                text: repoDocInfo.title,
                // icon: shortcut.active.icon,
                description: repoDocInfo.docInfo.description,
                group: 'Documents',
                handler: NULL_FUNCTION
            }
        }

        function toNoteCommand(current: ICommandWithHandler): ICommandExtended {

            const type = 'block';

            return {
                id: `${type}:${current.id}`,
                type,
                text: current.text,
                group: 'Block',
                handler: current.handler
            }

        }

        const keyboardShortcutCommands = shortcuts.map(toKeyboardShortcutCommand);
        const docCommands = docInfos.map(toDocCommand);
        const noteCommands = noteCommandsProvider().map(toNoteCommand);

        return [...keyboardShortcutCommands, ...docCommands, ...noteCommands];

    }, [shortcuts, docInfos, blocks, noteCommandsProvider]);

    const commandsProvider: CommandsProvider<ICommandExtended> = React.useCallback((): ReadonlyArray<ICommandExtended> => {
        return commands;
    }, [blocks, docInfos, shortcuts]);

    const handleCommand = React.useCallback((command: ICommandExtended, event: GenericInputEvent) => {
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


