import {SpectronMain2} from '../../js/test/SpectronMain2';
import {IPCClients} from '../../js/ipc/handler/IPCClients';

SpectronMain2.create().run(async state => {

    // invoke a method on the renderer and get the response..

    let ipcClient = IPCClients.mainProcess();

    await ipcClient.execute('/hello', 'hey');

    await state.testResultWriter.write(true);

});
