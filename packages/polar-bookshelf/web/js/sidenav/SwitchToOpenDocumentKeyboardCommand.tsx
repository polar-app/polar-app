import * as React from "react";
import {ICommand} from "../mui/command_menu/MUICommandMenu";
import {TabDescriptor, useSideNavCallbacks, useSideNavStore} from "./SideNavStore";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {MUICommandMenuKeyboardShortcut} from "../mui/command_menu/MUICommandMenuKeyboardShortcut";

export const SwitchToOpenDocumentKeyboardCommand = () => {

    const {tabs, activeTab} = useSideNavStore(['tabs', 'activeTab']);
    const {setActiveTab} = useSideNavCallbacks();

    const commandsProvider = React.useCallback(() => {

        function toCommand(tab: TabDescriptor): ICommand {
            return {
                id: tab.id,
                text: tab.title
            }
        }

        return arrayStream(tabs).sort((a,b) => a.lastActivated.localeCompare(b.lastActivated))
                                .filter(current => current.id !== activeTab)
                                .reverse()
                                .map(toCommand)
                                .collect();

    }, [activeTab, tabs]);

    const handleCommand = React.useCallback((command: ICommand) => {
        setActiveTab(command.id);
    }, [setActiveTab]);

    return (
        <MUICommandMenuKeyboardShortcut group="Documents"
                                        name="Switch to Open Document"
                                        description="Switch to an open document"
                                        sequences={[
                                            {
                                                keys: 'shift+command+e',
                                                platforms: ['macos']
                                            },
                                            {
                                                keys: 'shift+ctrl+E',
                                                platforms: ['windows', 'linux']
                                            }
                                        ]}
                                        onCommand={handleCommand}
                                        commandsProvider={commandsProvider}/>
    );

}
