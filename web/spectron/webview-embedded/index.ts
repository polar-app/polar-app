
import {webContents, webFrame, webviewTag} from "electron";
import {SpectronMain} from '../../js/test/SpectronMain';
import {Promises} from '../../js/util/Promises';

SpectronMain.run(async state => {

    state.window.loadFile(__dirname + '/app.html');

    // FIXME: this works, just not from the main process.. only the renderer.. .
    // let webView = webFrame.getFrameForSelector('webview');
    // console.log("FIXME: webView: ", webView);

    // TODO: the only other way I can think to do it is to listen to events as
    // they are loading...

    await Promises.waitFor(5000);

    // Returns WebContents[] - An array of all WebContents instances. This will
    // contain web contents for all windows, webviews, opened devtools, and
    // devtools extension background pages

    // this shold work!!!


    console.log("FIXME: we have N webcontents: ", webContents.getAllWebContents().length);

    webContents.getAllWebContents().forEach(async current => {
        console.log("============");
        console.log("Found webContents ID: ", current.id);
        console.log("Found webContents URL: ", current.getURL());
        console.log("Found webContents:", current);
        console.log("Location: ", await current.executeJavaScript('document.location.href;'));
    });

    // FIXME: this does not work
    console.log("====================\n\n\nFIXME:" , webContents.fromId(1234));

    await state.testResultWriter.write(true);

});
