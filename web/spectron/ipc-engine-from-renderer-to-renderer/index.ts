import {ipcMain, ipcRenderer, remote} from 'electron';
import {SpectronMain2} from '../../js/test/SpectronMain2';
import {SyncPipes} from '../../js/ipc/pipes/SyncPipes';

SpectronMain2.create().run(async state => {

    ipcMain.on('/main', (event: Electron.Event, message: any) => {
    });

    // invoke a method on the renderer and get the response..

    ipcMain.on('/ipc-trace', (event: Electron.Event, message: any) => {
        console.log("IPC Trace Sender: ", event.sender.id);

        console.log("Got IPC trace in main process: ", message);
    });


    let serviceWindow = state.window;
    let clientWindow = await state.createWindow();

    console.log("Service window ID: " + serviceWindow.id);
    console.log("Client window ID: " + clientWindow.id);

    serviceWindow.loadFile(__dirname + '/service.html');
    clientWindow.loadFile(__dirname + '/client.html');

    console.log("serviceWindow sync... ");
    await SyncPipes.fromMainToBrowserWindow(serviceWindow, 'service').sync();
    console.log("serviceWindow sync... done");

    console.log("clientWindow sync... ");
    await SyncPipes.fromMainToBrowserWindow(clientWindow, 'client').sync();
    console.log("clientWindow sync... done");

    clientWindow.webContents.send('/start-ipc', {target_window: serviceWindow.id});

    // let ipcClient = IPCClients.fromMainToRenderer(state.window);
    //
    // // TODO : this isn't really a good test and we should use a SyncPipe to make
    // // sure both sides are up and online and communicating.
    // await Promises.waitFor(1000);
    //
    // //let ipcClient = IPCClients.mainProcess();
    //
    // console.log("Executing request ...");
    //
    // await ipcClient.execute('/hello', 'hey');
    //
    // console.log("Executing request ...done");
    //
    // await state.testResultWriter.write(true);

});
