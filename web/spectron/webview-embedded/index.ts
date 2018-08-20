
import {webContents, WebContents, webFrame, webviewTag} from "electron";
import {SpectronMain} from '../../js/test/SpectronMain';
import {Promises} from '../../js/util/Promises';

SpectronMain.run(async state => {


    state.window.loadFile(__dirname + '/app.html');

    // FIXME: this works, just not from the main process.. only the renderer.. .
    // let webView = webFrame.getFrameForSelector('webview');
    // console.log("FIXME: webView: ", webView);

    // TODO: the only other way I can think to do it is to listen to events as
    // they are loading...

    await Promises.waitFor(2000);

    webContents.getAllWebContents().forEach(async current => {
        console.log("============")
        console.log("Found webContents ID: ", current.id);
        console.log("Found webContents URL: ", current.getURL());
        console.log("Found webContents:", current);
        console.log("Location: ", await current.executeJavaScript('document.location.href;'));
    });

    console.log("====================\n\n\nFIXME:" , webContents.fromId(1234));


    await state.testResultWriter.write(true);

});
