import * as React from "react";
import {ICommand} from "../mui/command_menu/MUICommandMenu";
import {MUICommandMenuKeyboardShortcut} from "../mui/command_menu/MUICommandMenuKeyboardShortcut";
import {observer} from "mobx-react-lite"
import {useNoteLinkLoader} from "./NoteLinkLoader";
import {NamedContent} from "./store/BlocksStore";
import {BlockTextContentUtils, useNamedBlocks} from "./NoteUtils";
import {Block} from "./store/Block";

export const JumpToNoteKeyboardCommand = observer(() => {

    const noteLinkLoader = useNoteLinkLoader();

    const namedBlocks = useNamedBlocks({ sort : true });

    const commandsProvider = React.useCallback(() => {

        function toCommand(block: Block<NamedContent>): ICommand {
            const text = BlockTextContentUtils.getTextContentMarkdown(block.content);
            return { id: text, text };
        }

        return [...namedBlocks].sort().map(toCommand);

    }, [namedBlocks]);

    const handleCommand = React.useCallback((command: ICommand) => {
        noteLinkLoader(command.id);
    }, [noteLinkLoader]);

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
