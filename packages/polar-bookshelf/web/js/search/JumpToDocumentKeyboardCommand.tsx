import * as React from "react";
import {CommandsProvider, ICommandWithHandler, OnCommandHandler} from "../mui/command_menu/MUICommandMenu";
import {MUICommandMenuKeyboardShortcut} from "../mui/command_menu/MUICommandMenuKeyboardShortcut";
import {observer} from "mobx-react-lite"
import {IKeyboardShortcutEvent} from "../keyboard_shortcuts/KeyboardShortcutsStore";
import {useDocRepoStore} from "../../../apps/repository/js/doc_repo/DocRepoStore2";
import {useDocLoaderForDocInfo} from "../apps/main/DocLoaderHooks";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import DescriptionIcon from '@material-ui/icons/Description';

function useDocInfos() {

    const {data} = useDocRepoStore(['data']);

    return React.useMemo(() => {

        const docs = data.map(current => current.docInfo);

        function toTitle(title: string | undefined) {
            return title || 'Untitled';
        }

        return docs.sort((a, b) => toTitle(a.title).localeCompare(toTitle(b.title)));

    }, [data]);

}


export function useJumpToDocumentKeyboardCommands(): Readonly<[CommandsProvider<ICommandWithHandler>, OnCommandHandler<ICommandWithHandler>]> {

    const docLoader = useDocLoaderForDocInfo();

    const docInfos = useDocInfos();

    const commandsProvider = React.useCallback((): ReadonlyArray<ICommandWithHandler> => {

        function toCommand(docInfo: IDocInfo): ICommandWithHandler {

            const id = docInfo.fingerprint;
            const title = docInfo.title || 'Untitled';


            const handler = (event: IKeyboardShortcutEvent) => {
                console.log("Executing handler to load note: " + id);
                docLoader(docInfo);
            };

            return {
                id,
                text: title,
                handler,
                icon: <DescriptionIcon/>
            };

        }

        return docInfos.map(toCommand);

    }, [docInfos, docLoader]);

    const handleCommand = React.useCallback((command: ICommandWithHandler, event: IKeyboardShortcutEvent) => {
        command.handler(event);
    }, []);

    return [commandsProvider, handleCommand];

}

export const JumpToDocumentKeyboardCommand = observer(() => {

    const [commandsProvider, handleCommand] = useJumpToDocumentKeyboardCommands();

    return (
        <MUICommandMenuKeyboardShortcut group="Documents"
                                        name="Jump to Document by Name"
                                        description="Jump to a document by name"
                                        enableIcons={true}
                                        sequences={[
                                            {
                                                keys: 'shift+command+d',
                                                platforms: ['macos']
                                            },
                                            {
                                                keys: 'shift+ctrl+D',
                                                platforms: ['windows', 'linux']
                                            }
                                        ]}
                                        onCommand={handleCommand}
                                        commandsProvider={commandsProvider}/>
    );

})
