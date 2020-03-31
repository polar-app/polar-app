import * as React from 'react';
import {Logging} from '../../../web/js/logger/Logging';
import {Logger} from 'polar-shared/src/logger/Logger';
import {PDFApp} from "./PDFApp";

const log = Logger.create();

async function start() {

    await Logging.init();

    const pdfApp = new PDFApp();

    pdfApp.start().catch(err => log.error(err));

}

start()
    .catch(err => log.error("Could not start repository app: ", err));
