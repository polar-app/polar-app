import * as React from "react";
import {ICommand, MUICommandMenu} from "../../../web/js/mui/command_menu/MUICommandMenu";
import AcUnitIcon from '@material-ui/icons/AcUnit';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import AccessibleIcon from '@material-ui/icons/Accessible';

const Example1 = () => {

    const commands: ReadonlyArray<ICommand> = [
        {
            id: 'world-war-I',
            text: 'World War I'
        },
        {
            id: 'world-war-II',
            text: 'World War II'
        },
    ];

    const commandsProvider = () => commands;

    return (
        <div>

            <MUICommandMenu onCommand={id => console.log("Executed command: " + id)}
                            onClose={reason => console.log('onClose: ' + reason)}
                            commandsProvider={commandsProvider}/>

        </div>
    )

}


const Example2 = () => {

    const commands: ReadonlyArray<ICommand> = [
        {
            id: 'ac',
            text: 'Turn On the AC',
            icon: <AcUnitIcon/>
        },
        {
            id: 'Turn On the Alarm',
            text: 'World War II',
            icon: <AccessAlarmIcon/>
        },
    ];

    const commandsProvider = () => commands;

    return (
        <div>

            <MUICommandMenu onCommand={id => console.log("Executed command: " + id)}
                            onClose={reason => console.log('onClose: ' + reason)}
                            commandsProvider={commandsProvider}/>

        </div>
    )

}


const Example3 = () => {

    const commands: ReadonlyArray<ICommand> = [
        {
            id: 'ac',
            text: 'Turn On the AC',
            icon: <AcUnitIcon/>,
            sequences: ["command+1"]

        },
        {
            id: 'alarm',
            text: 'Turn On the Alarm',
            icon: <AccessAlarmIcon/>,
            sequences: ["command+2", 'ctrl+2']
        },
        {
            id: 'wheelchair',
            text: 'Enable Wheelchair Access',
            icon: <AccessibleIcon/>,
            sequences: ["shift+ArrowRight"]
        },
    ];

    const commandsProvider = () => commands;

    return (
        <div>

            <MUICommandMenu onCommand={id => console.log("Executed command: " + id)}
                            onClose={reason => console.log('onClose: ' + reason)}
                            commandsProvider={commandsProvider}/>

        </div>
    )

}

export const MUICommandMenuStory = () => {

    return (
        <div>

            <h3>Without Icons</h3>

            <Example1/>

            <br/>

            <h3>With Icons</h3>

            <Example2/>

            <h3>With Icons and Keyboard Binding</h3>

            <Example3/>

        </div>
    )

}