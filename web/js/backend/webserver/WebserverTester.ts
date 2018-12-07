import {AppPath} from "../../electron/app_path/AppPath";
import {WebserverConfig} from "./WebserverConfig";
import {FileRegistry} from "./FileRegistry";
import {Webserver} from "./Webserver";
import {AsyncFunction} from '../../util/AsyncWorkQueue';

export class WebserverTester {

    public static async run(dir: string) {

        AppPath.set(dir);
        const webserverConfig = new WebserverConfig(AppPath.get(), 8005);
        const fileRegistry = new FileRegistry(webserverConfig);
        const webserver = new Webserver(webserverConfig, fileRegistry);

        try {
            await webserver.start();
        } catch (e) {
            console.warn("Webserver already running.");
            throw e;
        }

    }

}

