import {SpectronMain2} from '../../js/test/SpectronMain2';
import {IPCClients} from '../../js/ipc/handler/IPCClients';
import {Promises} from '../../js/util/Promises';

SpectronMain2.create().run(async state => {

    // invoke a method on the renderer and get the response..

    state.window.loadFile(__dirname + '/app.html');

    let ipcClient = IPCClients.fromMainToRenderer(state.window);

    // TODO : this isn't really a good test and we should use a SyncPipe to make
    // sure both sides are up and online and communicating.
    await Promises.waitFor(1000);

    //let ipcClient = IPCClients.mainProcess();

    console.log("Executing request ...");

    await ipcClient.execute('/ping', 'hey');

    console.log("Executing request ...done");

    await state.testResultWriter.write(true);

});
