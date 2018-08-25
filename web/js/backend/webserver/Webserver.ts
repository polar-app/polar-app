// start a simple static HTTP server only listening on localhost

import {WebserverConfig} from './WebserverConfig';
import {FileRegistry} from './FileRegistry';
import {Logger} from '../../logger/Logger';
import {Preconditions} from '../../Preconditions';
import {Paths} from '../../util/Paths';

const express = require("express");
const serveStatic = require("serve-static");

const log = Logger.create();

export class Webserver {

    private webserverConfig: WebserverConfig;
    private fileRegistry: FileRegistry;

    private app: any;
    private server: any;

    constructor(webserverConfig: WebserverConfig, fileRegistry: FileRegistry) {

        this.webserverConfig = Preconditions.assertNotNull(webserverConfig, "webserverConfig");
        this.fileRegistry = Preconditions.assertNotNull(fileRegistry, "fileRegistry");;

    }

    start() {

        express.static.mime.define({'text/html': ['chtml']});

        this.app = express();

        this.app.use(serveStatic(this.webserverConfig.dir));
        this.server = this.app.listen(this.webserverConfig.port, "127.0.0.1");

        this.app.get(/files\/.*/, (req: any, res: any) => {

            try {

                log.info("Handling data at path: " + req.path);

                let hashcode = Paths.basename(req.path);

                if(! hashcode) {
                    let msg = "No key given for /file";
                    console.error(msg);
                    res.status(404).send(msg);
                } else if (!this.fileRegistry.hasKey(hashcode)) {
                    let msg = "File not found with hashcode: " + hashcode;
                    console.error(msg);
                    res.status(404).send(msg);
                } else {

                    let keyMeta = this.fileRegistry.get(hashcode);
                    let filename = keyMeta.filename;

                    log.info(`Serving file at ${req.path} from ${filename}`);

                    return res.sendFile(filename);

                }

            } catch (e) {
                console.error(e);
            }

        });

        log.info(`Webserver up and running on port ${this.webserverConfig.port}`);

    }

    stop() {
        this.server.close();
    }

}
