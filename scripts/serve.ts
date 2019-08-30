import {Webserver} from '../web/js/backend/webserver/Webserver';
import {FileRegistry} from '../web/js/backend/webserver/FileRegistry';
import {WebserverCerts} from '../web/js/backend/webserver/WebserverCerts';
import {DefaultRewrites} from "../web/js/backend/webserver/DefaultRewrites";
import {WebserverConfigs} from "../web/js/backend/webserver/WebserverConfig";

const webserverConfig = WebserverConfigs.create({
   dir: 'dist/public',
   port: 443,
   host: 'localhost',
   useSSL: true,
   ssl: {
       cert: WebserverCerts.CERT,
       key: WebserverCerts.KEY,
   },
   rewrites: DefaultRewrites.create()
});

const fileRegistry = new FileRegistry(webserverConfig);

const webserver = new Webserver(webserverConfig, fileRegistry);
webserver.start()
    .catch(err => console.log("Unable to start webserver: ", err));

