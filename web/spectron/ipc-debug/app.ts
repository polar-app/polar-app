import {ipcRenderer} from 'electron';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async () => {

    console.log("Running within SpectronRenderer now.");

    ipcRenderer.on('what-is-your-name', (event: Electron.Event, message: any) => {
        console.log("Received event and message: ", {event, message});

        event.sender.send('and-what-is-your-name', 'my name is ipcRenderer');

    });

    ipcRenderer.on('oh-my-name-is', (event: Electron.Event, message: any) => {
        console.log("Received event and message: ", {event, message});
    });

    ipcRenderer.send('hello', 'this is the message');

});
