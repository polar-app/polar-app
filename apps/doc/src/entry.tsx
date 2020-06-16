import * as React from 'react';
import {Logging} from '../../../web/js/logger/Logging';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocViewerApp} from "./DocViewerApp";

import '@fortawesome/fontawesome-free/css/all.min.css';

const log = Logger.create();

async function start() {

    await Logging.init();

    const pdfApp = new DocViewerApp();

    pdfApp.start()
        .catch(err => log.error(err));

}

start()
    .catch(err => log.error("Could not start repository app: ", err));
