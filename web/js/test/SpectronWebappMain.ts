import {AppPath} from '../electron/app_path/AppPath';
import {SpectronMain2} from './SpectronMain2';
import {PolarDataDir} from './PolarDataDir';
import {WebserverConfig} from '../backend/webserver/WebserverConfig';
import {FileRegistry} from '../backend/webserver/FileRegistry';
import {Webserver} from '../backend/webserver/Webserver';

export class SpectronWebappMain {

    public static run(webRoot: string, appRoot: string, path: string) {

        AppPath.set(appRoot);

        SpectronMain2.create().run(async state => {

            await PolarDataDir.useFreshDirectory('.polar-firebase-datastore');

            // the webserver must be running as firebase won't load without being on an
            // HTTP URL

            console.log("Running with app path: " + AppPath.get());

            console.log("Running with web root: " + webRoot);

            const webserverConfig = new WebserverConfig(webRoot, 8005);

            const fileRegistry = new FileRegistry(webserverConfig);
            const webserver = new Webserver(webserverConfig, fileRegistry);

            try {
                await webserver.start();
            } catch (e) {
                console.warn("Webserver already running.");
            }

            const url = `http://localhost:8005${path}`;
            await state.window.loadURL(url);

        });

    }

}
