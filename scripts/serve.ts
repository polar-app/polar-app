import {WebserverConfig} from '../web/js/backend/webserver/WebserverConfig';
import {AppPath} from '../web/js/electron/app_path/AppPath';
import {Webserver} from '../web/js/backend/webserver/Webserver';
import {FileRegistry} from '../web/js/backend/webserver/FileRegistry';
import {WebserverCerts} from '../web/js/backend/webserver/WebserverCerts';

const webserverConfig = WebserverConfig.create({
   dir: 'dist/public',
   port: 443,
   host: 'localhost',
   useSSL: true,
   ssl: {
       cert: WebserverCerts.CERT,
       key: WebserverCerts.KEY,
   }
});

const fileRegistry = new FileRegistry(webserverConfig);

const webserver = new Webserver(webserverConfig, fileRegistry);
webserver.start()
    .catch(err => console.log("Unable to start webserver: ", err));

