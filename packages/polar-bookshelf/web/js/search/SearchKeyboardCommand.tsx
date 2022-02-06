import * as React from "react";
import {MUICommandMenuKeyboardShortcut} from "../mui/command_menu/MUICommandMenuKeyboardShortcut";
import {observer} from "mobx-react-lite"
import {useJumpToNoteKeyboardCommands} from "./JumpToNoteKeyboardCommand";
import {useJumpToDocumentKeyboardCommands} from "./JumpToDocumentKeyboardCommand";
import {ICommandWithHandler} from "../mui/command_menu/MUICommandMenu";
import {IKeyboardShortcutEvent} from "../keyboard_shortcuts/KeyboardShortcutsStore";

export const SearchKeyboardCommand = observer(() => {

    const [notesCommandsProvider] = useJumpToNoteKeyboardCommands();
    const [documentsCommandsProvider] = useJumpToDocumentKeyboardCommands();

    const commandsProvider = React.useCallback(() => {

        const notesCommands = notesCommandsProvider();
        const documentsCommands = documentsCommandsProvider()

        return [...notesCommands, ...documentsCommands].sort((a, b) => a.text.localeCompare(b.text));

    }, [notesCommandsProvider, documentsCommandsProvider]);

    const handleCommand = React.useCallback((command: ICommandWithHandler, event: IKeyboardShortcutEvent) => {
        command.handler(event);
    }, []);

    return (
        <MUICommandMenuKeyboardShortcut group="Search"
                                        name="Search"
                                        description="Search Across All Items"
                                        enableIcons={true}
                                        sequences={[
                                            {
                                                keys: 'shift+command+s',
                                                platforms: ['macos']
                                            },
                                            {
                                                keys: 'shift+ctrl+S',
                                                platforms: ['windows', 'linux']
                                            }
                                        ]}
                                        onCommand={handleCommand}
                                        commandsProvider={commandsProvider}/>
    );

})
