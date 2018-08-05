import {ipcRenderer} from 'electron';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {PingService} from '../../js/ipc/handler/ping/PingService';
import {IPCEngines} from '../../js/ipc/handler/IPCEngines';
import {SyncPipes} from '../../js/ipc/pipes/SyncPipes';

SpectronRenderer.run(async () => {

    ipcRenderer.on('/service', (event: Electron.Event, message: any) => {
    });

    ipcRenderer.on('/ipc-trace', (event: Electron.Event, message: any) => {
        console.log("IPC Trace Sender: ", event.sender.id);
        console.log("Got IPC trace in service: ", message);
    });

    ipcRenderer.on('/test', (event: Electron.Event, message: any) => {
        console.log("Got test!")
    });

    ipcRenderer.on('/ping', (event: Electron.Event, message: any) => {
        console.log("Got ping in service window")
    });

    await new PingService(IPCEngines.rendererProcess()).start();

    await SyncPipes.fromRendererToMain('service').sync()

});
