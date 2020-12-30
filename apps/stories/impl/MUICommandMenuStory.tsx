import * as React from "react";
import {ICommand, MUICommandMenu} from "../../../web/js/mui/command_menu/MUICommandMenu";

const commands: ReadonlyArray<ICommand> = [
    {
        id: '0',
        text: 'World War I'
    },
    {
        id: '1',
        text: 'World War II'
    },
];

export const MUICommandMenuStory = () => {

    const commandsProvider = () => commands;

    return (
        <MUICommandMenu onCommand={id => console.log("Executed command: " + id)}
                        onClose={reason => console.log('onClose: ' + reason)}
                        commandsProvider={commandsProvider}/>
    )

}