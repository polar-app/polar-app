import {app} from 'electron';
import {SpectronMain2} from '../../js/test/SpectronMain2';
import {WebserverConfig} from '../../js/backend/webserver/WebserverConfig';
import {Webserver} from '../../js/backend/webserver/Webserver';
import {FileRegistry} from '../../js/backend/webserver/FileRegistry';

SpectronMain2.create().run(async state => {

    const appDir = process.cwd();
    console.log("serving app at: " + appDir);
    const webserverConfig = new WebserverConfig(appDir, 8005);

    const fileRegistry = new FileRegistry(webserverConfig);
    const webserver = new Webserver(webserverConfig, fileRegistry);
    webserver.start();

    state.window.loadURL(`http://localhost:8005/web/spectron/firebase-auth/content.html`);

    await state.testResultWriter.write(true);

});

