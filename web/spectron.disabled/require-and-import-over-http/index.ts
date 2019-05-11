import {SpectronMain2} from '../../js/test/SpectronMain2';
import {WebserverConfig} from '../../js/backend/webserver/WebserverConfig';
import {Webserver} from '../../js/backend/webserver/Webserver';
import {FileRegistry} from '../../js/backend/webserver/FileRegistry';
import {ResourceRegistry} from '../../js/backend/webserver/ResourceRegistry';
import {FilePaths} from '../../js/util/FilePaths';

SpectronMain2.create().run(async state => {

    const webserverConfig = new WebserverConfig(__dirname, 12345);

    const fileRegistry = new FileRegistry(webserverConfig);
    const resourceRegistry = new ResourceRegistry();

    const webserver = new Webserver(webserverConfig, fileRegistry, resourceRegistry);
    await webserver.start();

    await state.window.loadFile(FilePaths.join(__dirname, "content.html"));

});



