import {SpectronMain2} from '../../js/test/SpectronMain2';
import {WebserverConfig} from '../../js/backend/webserver/WebserverConfig';

import os from 'os';
import {Webserver} from '../../js/backend/webserver/Webserver';
import {FileRegistry} from '../../js/backend/webserver/FileRegistry';
import {ResourceRegistry} from '../../js/backend/webserver/ResourceRegistry';

SpectronMain2.create().run(async state => {

    const webserverConfig = new WebserverConfig(os.tmpdir(), 12345);

    const fileRegistry = new FileRegistry(webserverConfig);
    const resourceRegistry = new ResourceRegistry();

    resourceRegistry.register('/content.html', `${__dirname}/content.html`);
    resourceRegistry.register('/content.js', `${__dirname}/content.js`);
    resourceRegistry.register('/Foo.js', `${__dirname}/Foo.js`);

    const webserver = new Webserver(webserverConfig, fileRegistry, resourceRegistry);
    webserver.start();


    state.window.loadURL(`http://localhost:12345/content.html`);
    // state.window.loadURL(`file://${__dirname}/content.html`);


    await state.testResultWriter.write(true);

});



