import {ipcMain, ipcRenderer, remote} from 'electron';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {PingService} from '../../js/ipc/handler/ping/PingService';
import {IPCEngines} from '../../js/ipc/handler/IPCEngines';
import {SyncPipes} from '../../js/ipc/pipes/SyncPipes';
import {IPCClients} from '../../js/ipc/handler/IPCClients';
import {WindowReference} from '../../js/ui/dialog_window/WindowReference';

SpectronRenderer.run(async (state) => {

    await new PingService(IPCEngines.rendererProcess()).start();

    ipcRenderer.on('/client', (event: Electron.Event, message: any) => {
    });

    ipcRenderer.on('/ipc-trace', (event: Electron.Event, message: any) => {
        console.log("Got IPC trace in client: ", message);
    });

    ipcRenderer.on('/start-ipc', async (event: Electron.Event, message: any) => {

        console.log("Start IPC Sender: ", event.sender.id);

        console.log("Got start IPC message.  Going to call IPC execute.");

        console.log("Sending test...");

        ipcRenderer.sendTo(1, '/test', 'hello');

        console.log("Sending test...done");

        let target_window: number = message.target_window;

        console.log("Using target window: " + target_window);

        let ipcClient = IPCClients.fromRendererToRenderer(new WindowReference(message.target_window));

        console.log("Executing ping...");

        await ipcClient.execute('/ping', 'hello');

        console.log("Executing ping...done");

        state.testResultWriter.write(true);

    });

    await SyncPipes.fromRendererToMain('client').sync()

});
