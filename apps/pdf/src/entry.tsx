import * as React from 'react';
import {Logging} from '../../../web/js/logger/Logging';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocViewerApp} from "./DocViewerApp";

const log = Logger.create();

async function start() {

    await Logging.init();

    // const appURL = PDFAppURLs.parse(document.location.href);
    //
    // if (! appURL) {
    //     throw new Error("No app URL");
    // }

    const pdfApp = new DocViewerApp();

    pdfApp.start()
        .catch(err => log.error(err));

}

start()
    .catch(err => log.error("Could not start repository app: ", err));
