import {SpectronMain2} from '../../js/test/SpectronMain2';
import {BrowserWindow} from "electron";
import {DocInfoBroadcasterService} from '../../js/datastore/advertiser/DocInfoBroadcasterService';

const BROWSER_OPTIONS = {
    backgroundColor: '#FFF',

    // NOTE: the default width and height shouldn't be changed here as it can
    // break unit tests.

    webPreferences: {
        webSecurity: false,
    }

};

SpectronMain2.create().run(async state => {

    await new DocInfoBroadcasterService().start();

    state.window.loadURL(`file://${__dirname}/sending-app.html`);

    const mainWindow = new BrowserWindow(BROWSER_OPTIONS);

    mainWindow.loadURL(`file://${__dirname}/receiving-app.html`);

});
