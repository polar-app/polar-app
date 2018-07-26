import {ContentCaptureClient} from '../../js/capture/renderer/ContentCaptureClient';
import {SpectronMain} from '../../js/test/SpectronMain';
import {MainTestResultsWriter} from '../../js/test/results/writer/MainTestResultsWriter';

async function start() {

    let mainWindow = await SpectronMain.setup();

    mainWindow.webContents.toggleDevTools();

    let contentCaptureClient = new ContentCaptureClient(mainWindow);

    let waitForControllerPromise = contentCaptureClient.waitForController();

    mainWindow.loadFile(__dirname + '/app.html');

    console.log("Waiting for controller startup promise...");
    await waitForControllerPromise;
    console.log("Waiting for controller startup promise...done");

    console.log("Waiting for new capture result now:");

    let captured = await contentCaptureClient.requestNewCapture();

    console.log("GOT IT!", captured);

    let mainTestResultsWriter = new MainTestResultsWriter(mainWindow);

    mainTestResultsWriter.write(captured);

    // now we need to tell spectron we have it... that's part of the challenge
    // her.

}

start().catch(err => console.log(err));
