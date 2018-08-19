
import {webContents} from "electron";
import {SpectronMain} from '../../js/test/SpectronMain';
import {Promises} from '../../js/util/Promises';

SpectronMain.run(async state => {

    state.window.loadFile(__dirname + '/app.html');

    await Promises.waitFor(2000);
    console.log("Waiting 2 seconds...done");

    console.log("FIXME: WebContents: " , webContents);

    webContents.getAllWebContents().forEach(async current => {
        console.log("============")
        console.log("Found webContents ID: ", current.id);
        console.log("Found webContents:", current);
        console.log("FIXME location: ", await current.executeJavaScript('document.location.href;'));
    });

    await state.testResultWriter.write(true);

});
