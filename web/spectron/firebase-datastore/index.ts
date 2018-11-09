import {app, BrowserWindow} from 'electron';
import {ISpectronMainOptions, SpectronMain2} from '../../js/test/SpectronMain2';
import {WebserverConfig} from '../../js/backend/webserver/WebserverConfig';
import {Webserver} from '../../js/backend/webserver/Webserver';
import {FileRegistry} from '../../js/backend/webserver/FileRegistry';
import {SpectronBrowserWindowOptions} from '../../js/test/SpectronBrowserWindowOptions';
import {PolarDataDir} from '../../js/test/PolarDataDir';
import {FilePaths} from '../../js/util/FilePaths';
import process from "process";

PolarDataDir.useFreshDirectory('.polar-firebase-datastore');

async function defaultWindowFactory(): Promise<BrowserWindow> {
    const mainWindow = new BrowserWindow(SpectronBrowserWindowOptions.create());
    // mainWindow.webContents.toggleDevTools();
    mainWindow.loadURL('about:blank');
    return mainWindow;
}


const options: ISpectronMainOptions = {
    windowFactory: defaultWindowFactory
};

SpectronMain2.create(options).run(async state => {

    // the webserver must be running as firebase won't load without being on an
    // HTTP URL

    console.log("Running with app path: " + app.getAppPath());
    console.log("Running with CWD: " + process.cwd());

    const appDir = process.cwd();
    const webserverConfig = new WebserverConfig(appDir, 8005);

    const fileRegistry = new FileRegistry(webserverConfig);
    const webserver = new Webserver(webserverConfig, fileRegistry);

    try {
        webserver.start();
    } catch (e) {
        console.warn("Webserver already running.");
    }

    // const path = FilePaths.create(__dirname, "content.html");
    // state.window.loadFile(path);

    const url = `http://localhost:8005/web/spectron/firebase-datastore/content.html`;
    state.window.loadURL(url);

});


