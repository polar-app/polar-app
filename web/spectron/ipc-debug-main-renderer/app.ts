import {ipcMain, ipcRenderer} from 'electron';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async () => {

    console.log("Running within SpectronRenderer now.");

    ipcRenderer.on('hello', (event: Electron.Event, message: any) => {
        console.log("Received event and message: ", {event, message});
        event.sender.send('what-is-your-name', 'this is a response message from ipcMain');
    });

    ipcRenderer.on('and-what-is-your-name', (event: Electron.Event, message: any) => {
        console.log("Received event and message: ", {event, message});
        event.sender.send('oh-my-name-is', 'oh, yeah. my name is ipcMain');
    });


});
