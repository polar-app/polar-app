import {ContentCaptureClient} from '../../js/capture/renderer/ContentCaptureClient';

const {SpectronRenderer} = require("../../js/test/SpectronRenderer");

async function start() {

    let mainWindow = await SpectronRenderer.start();

    let contentCaptureClient = new ContentCaptureClient(mainWindow);

    let waitForControllerPromise = contentCaptureClient.waitForController();

    mainWindow.loadFile(__dirname + '/app.html');

    console.log("Waiting for controller startup promise...");
    await waitForControllerPromise;
    console.log("Waiting for controller startup promise...done");

    console.log("Waiting for new capture result now:");

    await contentCaptureClient.requestNewCapture();

    console.log("GOT IT!");

    // now we need to tell spectron we have it... that's part of the challenge
    // her.

}

start().catch(err => console.log(err));
