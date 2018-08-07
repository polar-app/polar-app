import {SpectronMain2} from '../../js/test/SpectronMain2';
import {ipcMain} from "electron";

SpectronMain2.create().run(async state => {

    let primaryWindow = state.window;
    let secondaryWindow = state.window;

    primaryWindow.loadFile(__dirname + '/app.html');
    secondaryWindow.loadFile(__dirname + '/app.html');

    ipcMain.on('what-is-your-name', (event: Electron.Event, message: any) => {
        console.log("Received event and message: ", {event, message});

        event.sender.send('and-what-is-your-name', 'my name is ipcRenderer');

    });

    ipcMain.on('oh-my-name-is', (event: Electron.Event, message: any) => {
        console.log("Received event and message: ", {event, message});
    });

    // get the focused window and then send it a message

    await state.testResultWriter.write(true);

});
