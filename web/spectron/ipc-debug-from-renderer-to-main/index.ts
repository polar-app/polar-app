import {SpectronMain2} from '../../js/test/SpectronMain2';
import {PingService} from '../../js/ipc/handler/ping/PingService';
import {IPCEngines} from '../../js/ipc/handler/IPCEngines';

SpectronMain2.create().run(async state => {

    await new PingService(IPCEngines.mainProcess()).start();

    console.log("Ping service started.  Going to load the app now.")

    state.window.loadFile(__dirname + '/app.html');

});
