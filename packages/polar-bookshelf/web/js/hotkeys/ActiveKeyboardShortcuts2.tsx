import * as React from "react";
import {deepMemo} from "../react/ReactUtils";
import {CommandsProvider, ICommand} from "../mui/command_menu/MUICommandMenu";
import {MUICommandMenuKeyboardShortcut} from "../mui/command_menu/MUICommandMenuKeyboardShortcut";
import {ShortcutEntry, useKeyboardShortcutsStore} from "../keyboard_shortcuts/KeyboardShortcutsStore";
import {useDocRepoStore} from "../../../apps/repository/js/doc_repo/DocRepoStore2";
import {RepoDocInfo} from "../../../apps/repository/js/RepoDocInfo";
import {useNamedBlocks} from "../notes/NoteUtils";
import {IBlock, INamedContent} from "polar-blocks/src/blocks/IBlock";

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

    const commandsProvider: CommandsProvider<ICommandWithType> = React.useCallback((): ReadonlyArray<ICommandWithType> => {

        function toKeyboardShortcutCommand(shortcut: ShortcutEntry, idx: number): ICommandWithType {
            return {
                id: `${idx}`,
                type: 'keyboard-shortcut',
                text: shortcut.active.name,
                icon: shortcut.active.icon,
                description: shortcut.active.description,
                group: shortcut.active.group,
                // FIXME this shows too many sequences.  They're not platform specific
                sequences: shortcut.active.sequences
            }
        }

        function toDocCommand(repoDocInfo: RepoDocInfo): ICommandWithType {
            return {
                id: `${repoDocInfo.id}`,
                type: 'doc',
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


            return {
                id: `${block.id}`,
                type: 'block',
                text: computeText(),
                group: 'Block'
            }
        }


        const keyboardShortcutCommands = shortcuts.map(toKeyboardShortcutCommand);
        const docCommands = docInfos.map(toDocCommand);
        const blockCommands = blocks.map(toBlockCommand);

        // return [...keyboardShortcutCommands, ...docCommands, ...blockCommands];
        return [...keyboardShortcutCommands];

    }, [blocks, docInfos, shortcuts]);

    const handleCommand = React.useCallback((command: ICommandWithType) => {

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


