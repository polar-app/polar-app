import {SpectronMain} from '../../js/test/SpectronMain';
import {ipcMain} from "electron";

SpectronMain.run(async state => {

    state.window.loadFile(__dirname + '/app.html');

    ipcMain.on('hello', (event: Electron.Event, message: any) => {
        console.log("Received event and message: ", {event, message});
        event.sender.send('what-is-your-name', 'this is a response message from ipcMain');
    });

    ipcMain.on('and-what-is-your-name', (event: Electron.Event, message: any) => {
        console.log("Received event and message: ", {event, message});
        event.sender.send('oh-my-name-is', 'oh, yeah. my name is ipcMain');
    });

    await state.testResultWriter.write(true);

});
