import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {PingService} from '../../js/ipc/handler/ping/PingService';
import {IPCEngines} from '../../js/ipc/handler/IPCEngines';
import {SyncPipes} from '../../js/ipc/pipes/SyncPipes';

SpectronRenderer.run(async () => {

    await new PingService(IPCEngines.rendererProcess()).start();

    await SyncPipes.fromRendererToMain('service').sync()

});
