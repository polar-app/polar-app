import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {PingService} from '../../js/ipc/handler/ping/PingService';
import {IPCEngines} from '../../js/ipc/handler/IPCEngines';

SpectronRenderer.run(async () => {

    await new PingService(IPCEngines.rendererProcess()).start();

});
