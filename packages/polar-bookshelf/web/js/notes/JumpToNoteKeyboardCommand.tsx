import * as React from "react";
import {CommandsProvider, ICommandWithHandler, OnCommandHandler} from "../mui/command_menu/MUICommandMenu";
import {MUICommandMenuKeyboardShortcut} from "../mui/command_menu/MUICommandMenuKeyboardShortcut";
import {observer} from "mobx-react-lite"
import {useNoteLinkLoader} from "./NoteLinkLoader";
import {NamedContent} from "./store/BlocksStore";
import {BlockTextContentUtils, useNamedBlocks} from "./NoteUtils";
import {Block} from "./store/Block";
import {IKeyboardShortcutEvent} from "../keyboard_shortcuts/KeyboardShortcutsStore";

export function useJumpToNoteKeyboardCommands(): Readonly<[CommandsProvider<ICommandWithHandler>, OnCommandHandler<ICommandWithHandler>]> {

    const noteLinkLoader = useNoteLinkLoader();

    const namedBlocks = useNamedBlocks({ sort : true });

    const commandsProvider = React.useCallback((): ReadonlyArray<ICommandWithHandler> => {

        function toCommand(block: Block<NamedContent>): ICommandWithHandler {

            const id = block.id;
            const text = BlockTextContentUtils.getTextContentMarkdown(block.content);

            const handler = (event: IKeyboardShortcutEvent) => {
                noteLinkLoader(id);
            };

            return {id, text, handler};

        }

        return namedBlocks.map(toCommand);

    }, [namedBlocks]);

    const handleCommand = React.useCallback((command: ICommandWithHandler, event: IKeyboardShortcutEvent) => {
        command.handler(event);
    }, []);

    return [commandsProvider, handleCommand];

}

export const JumpToNoteKeyboardCommand = observer(() => {

    const [commandsProvider, handleCommand] = useJumpToNoteKeyboardCommands();

    return (
        <MUICommandMenuKeyboardShortcut group="Notes"
                                        name="Jump to Note by Name"
                                        description="Jump to a note by name"
                                        sequences={[
                                            {
                                                keys: 'shift+command+g',
                                                platforms: ['macos']
                                            },
                                            {
                                                keys: 'shift+ctrl+G',
                                                platforms: ['windows', 'linux']
                                            }
                                        ]}
                                        onCommand={handleCommand}
                                        commandsProvider={commandsProvider}/>
    );

})
