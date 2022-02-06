import * as React from "react";
import {CommandsProvider, ICommandWithHandler, OnCommandHandler} from "../mui/command_menu/MUICommandMenu";
import {MUICommandMenuKeyboardShortcut} from "../mui/command_menu/MUICommandMenuKeyboardShortcut";
import {observer} from "mobx-react-lite"
import {useNoteLinkLoader} from "../notes/NoteLinkLoader";
import {INamedBlockEntry, useBlocksStore} from "../notes/store/BlocksStore";
import {IKeyboardShortcutEvent} from "../keyboard_shortcuts/KeyboardShortcutsStore";
import NotesIcon from '@material-ui/icons/Notes';

export function useJumpToNoteKeyboardCommands(): Readonly<[CommandsProvider<ICommandWithHandler>, OnCommandHandler<ICommandWithHandler>]> {

    const noteLinkLoader = useNoteLinkLoader();

    const blocksStore = useBlocksStore();
    const namedBlocks = blocksStore.namedBlockEntries;

    const commandsProvider = React.useCallback((): ReadonlyArray<ICommandWithHandler> => {

        function toCommand({ label }: INamedBlockEntry): ICommandWithHandler {

            // these are ALL named notes so we should just use the text to jump to them.
            const id = label;

            const handler = (_: IKeyboardShortcutEvent) => {
                console.log("Executing handler to load note: " + id);
                noteLinkLoader(id);
            };

            return {
                id,
                text: label,
                handler,
                icon: <NotesIcon/>

            };

        }

        return namedBlocks.map(toCommand);

    }, [namedBlocks, noteLinkLoader]);

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
                                        enableIcons={true}
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
