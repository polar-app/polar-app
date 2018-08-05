import {ipcRenderer} from 'electron';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {PingService} from '../../js/ipc/handler/ping/PingService';
import {IPCEngines} from '../../js/ipc/handler/IPCEngines';
import {SyncPipes} from '../../js/ipc/pipes/SyncPipes';
import {IPCClients} from '../../js/ipc/handler/IPCClients';
import {WindowReference} from '../../js/ui/dialog_window/WindowReference';

SpectronRenderer.run(async () => {

    await new PingService(IPCEngines.rendererProcess()).start();

    ipcRenderer.on('/start-ipc', async (event: Electron.Event, message: any) => {

        console.log("Got start IPC message.  Going to call IPC execute.");

        let target_window: number = message.target_window;

        console.log("Using target window: " + target_window);

        let ipcClient = IPCClients.fromRendererToRenderer(new WindowReference(message.target_window));

        await ipcClient.execute('/ping', 'hello');

    });

    await SyncPipes.fromRendererToMain('client').sync()

});
