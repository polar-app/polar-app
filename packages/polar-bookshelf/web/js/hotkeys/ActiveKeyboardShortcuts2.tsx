import * as React from "react";
import {deepMemo} from "../react/ReactUtils";
import {CommandsProvider, ICommand} from "../mui/command_menu/MUICommandMenu";
import {MUICommandMenuKeyboardShortcut} from "../mui/command_menu/MUICommandMenuKeyboardShortcut";
import {ShortcutEntry, useKeyboardShortcutsStore} from "../keyboard_shortcuts/KeyboardShortcutsStore";
import {useDocRepoStore} from "../../../apps/repository/js/doc_repo/DocRepoStore2";
import {RepoDocInfo} from "../../../apps/repository/js/RepoDocInfo";
import {useNamedBlocks} from "../notes/NoteUtils";
import {IBlock, INamedContent} from "polar-blocks/src/blocks/IBlock";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

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

    interface ICommandWithType extends ICommand {
        readonly type: 'keyboard-shortcut' | 'doc' | 'block';
    }

    interface ICommandWithTypeMap {
        [key: string]: ICommandWithType
    }

    const commandsMap = React.useMemo((): Readonly<ICommandWithTypeMap> => {

        function toKeyboardShortcutCommand(shortcut: ShortcutEntry, idx: number): ICommandWithType {

            const type = 'keyboard-shortcut';

            return {
                id: `${type}:${idx}`,
                type,
                text: shortcut.active.name,
                icon: shortcut.active.icon,
                description: shortcut.active.description,
                group: shortcut.active.group,
                sequences: shortcut.active.sequences
            }
        }

        function toDocCommand(repoDocInfo: RepoDocInfo): ICommandWithType {

            const type = 'doc';

            return {
                id: `${type}:${repoDocInfo.id}`,
                type,
                text: repoDocInfo.title,
                // icon: shortcut.active.icon,
                description: repoDocInfo.docInfo.description,
                group: 'Documents'
            }
        }

        function toBlockCommand(block: IBlock<INamedContent>): ICommandWithType {

            function computeText(): string {
                switch (block.content.type) {
                    case "name":
                    case "date":
                        return block.content.data;
                    case "document":
                        return block.content.docInfo.title || 'Untitled';
                }
            }

            const type = 'block';

            return {
                id: `${type}:${block.id}`,
                type,
                text: computeText(),
                group: 'Block'
            }
        }

        const keyboardShortcutCommands = shortcuts.map(toKeyboardShortcutCommand);
        const docCommands = docInfos.map(toDocCommand);
        const blockCommands = blocks.map(toBlockCommand);


        return arrayStream([...keyboardShortcutCommands, ...docCommands, ...blockCommands])
                .toMap2(current => current.id, current => current)
                ;

    }, [shortcuts, docInfos, blocks]);

    const commands = React.useMemo(() => Object.values(commandsMap), [commandsMap]);

    const commandsProvider: CommandsProvider<ICommandWithType> = React.useCallback((): ReadonlyArray<ICommandWithType> => {
        return commands;
    }, [blocks, docInfos, shortcuts]);

    const handleCommand = React.useCallback((command: ICommandWithType) => {



        // TODO: resolve the command by type, then execute it...
        // TODO: all the commands need to have UNIQUE IDs in a larger global map...
        // TODO: handle executing the commands.

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


