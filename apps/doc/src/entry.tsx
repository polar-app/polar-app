import * as React from 'react';
import {Logging} from '../../../web/js/logger/Logging';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocViewerApp} from "./DocViewerApp";

const log = Logger.create();

async function start() {

    await Logging.init();

    const docViewerApp = new DocViewerApp();

    docViewerApp.start()
        .catch(err => log.error(err));

}

start()
    .catch(err => log.error("Could not start doc viewer app: ", err));
