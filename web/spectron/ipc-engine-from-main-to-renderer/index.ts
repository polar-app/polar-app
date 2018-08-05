import {SpectronMain2} from '../../js/test/SpectronMain2';
import {IPCClients} from '../../js/ipc/handler/IPCClients';

SpectronMain2.create().run(async state => {

    // invoke a method on the renderer and get the response..

    state.window.loadFile(__dirname + '/app.html');

    let ipcClient = IPCClients.fromMainToRenderer(state.window);

    //let ipcClient = IPCClients.mainProcess();

    console.log("Executing request ...");

    await ipcClient.execute('/hello', 'hey');

    console.log("Executing request ...done");

    await state.testResultWriter.write(true);

});
