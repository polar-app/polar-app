import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {IPCClients} from '../../js/ipc/handler/IPCClients';

SpectronRenderer.run(async (state) => {

    // invoke a method on the renderer and get the response..

    let ipcClient = IPCClients.rendererProcess();

    console.log("Executing request ...");

    await ipcClient.execute('/ping', 'hey');

    console.log("Executing request ...done");

    await state.testResultWriter.write(true);

});
