import * as React from "react";
import {deepMemo} from "../react/ReactUtils";
import {CommandsProvider, ICommand} from "../mui/command_menu/MUICommandMenu";
import {MUICommandMenuKeyboardShortcut} from "../mui/command_menu/MUICommandMenuKeyboardShortcut";
import {ShortcutEntry, useKeyboardShortcutsStore} from "../keyboard_shortcuts/KeyboardShortcutsStore";
import {useDocRepoStore} from "../../../apps/repository/js/doc_repo/DocRepoStore2";
import {RepoDocInfo} from "../../../apps/repository/js/RepoDocInfo";

function useDocInfos() {
    const {data} = useDocRepoStore(['data']);
    return data;
}

export const ActiveKeyboardShortcuts2 = deepMemo(() => {

    const {shortcuts} = useKeyboardShortcutsStore(['shortcuts'])

    const docInfos = useDocInfos();

    interface ICommandWithType extends ICommand {
        readonly type: 'keyboard-shortcut' | 'doc';
    }

    const commandsProvider: CommandsProvider<ICommandWithType> = React.useCallback((): ReadonlyArray<ICommandWithType> => {

        function toKeyboardShortcut(shortcut: ShortcutEntry, idx: number): ICommandWithType {
            return {
                id: `${idx}`,
                type: 'keyboard-shortcut',
                text: shortcut.active.name,
                icon: shortcut.active.icon,
                description: shortcut.active.description,
                group: shortcut.active.group
            }
        }

        function toDoc(repoDocInfo: RepoDocInfo, idx: number): ICommandWithType {
            return {
                id: `${repoDocInfo.id}`,
                type: 'doc',
                text: repoDocInfo.title,
                // icon: shortcut.active.icon,
                description: repoDocInfo.docInfo.description,
                group: 'Documents'
            }
        }

        const keyboardShortcutCommands = Object.values(shortcuts).map(toKeyboardShortcut);
        const docCommands = docInfos.map(toDoc);

        return [...keyboardShortcutCommands, ...docCommands];

    }, [docInfos, shortcuts]);

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


