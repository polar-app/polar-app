import {app, BrowserWindow} from 'electron';
import {ISpectronMainOptions, SpectronMain2} from '../../js/test/SpectronMain2';
import {WebserverConfig} from '../../js/backend/webserver/WebserverConfig';
import {Webserver} from '../../js/backend/webserver/Webserver';
import {FileRegistry} from '../../js/backend/webserver/FileRegistry';
import {SpectronBrowserWindowOptions} from '../../js/test/SpectronBrowserWindowOptions';
import {PolarDataDir} from '../../js/test/PolarDataDir';
import {FilePaths} from '../../js/util/FilePaths';
import {AppPath} from '../../js/electron/app_path/AppPath';

async function defaultWindowFactory(): Promise<BrowserWindow> {
    const mainWindow = new BrowserWindow(SpectronBrowserWindowOptions.create());
    mainWindow.loadURL('about:blank')
        .catch(err => console.error(err));

    return mainWindow;
}


const options: ISpectronMainOptions = {
    windowFactory: defaultWindowFactory
};

// TODO: the main problems with the home dir are now:
// FIXME: we have to use remote to get the directory to require() our files from
//

AppPath.set(__dirname);

SpectronMain2.create(options).run(async state => {

    await PolarDataDir.useFreshDirectory('.polar-firebase-datastore');

    // the webserver must be running as firebase won't load without being on an
    // HTTP URL

    const appDir = __dirname;
    const webserverConfig = new WebserverConfig(appDir, 8005);

    const fileRegistry = new FileRegistry(webserverConfig);
    const webserver = new Webserver(webserverConfig, fileRegistry);

    try {
        await webserver.start();
    } catch (e) {
        console.warn("Webserver already running.");
    }

    const url = `http://localhost:8005/content.html`;
    await state.window.loadURL(url);

});




