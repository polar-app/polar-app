import * as React from "react";
import {ICommand} from "../mui/command_menu/MUICommandMenu";
import { MUICommandMenuKeyboardShortcut } from "../mui/command_menu/MUICommandMenuKeyboardShortcut";
import { observer } from "mobx-react-lite"
import {useBlocksStore} from "./store/BlocksStore";
import {useNoteLinkLoader} from "./NoteLinkLoader";

export const JumpToNoteKeyboardCommand = observer(() => {

    const blocksStore = useBlocksStore();
    const noteLinkLoader = useNoteLinkLoader();

    const namedBlocks = blocksStore.getNamedBlocks();

    const commandsProvider = React.useCallback(() => {

        function toCommand(namedBlock: string): ICommand {
            return {
                id: namedBlock,
                text: namedBlock
            }
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
