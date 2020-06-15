import * as React from 'react';
import {Logging} from '../../../web/js/logger/Logging';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Repository} from "../../../web/js/apps/repository/Repository";

// TODO: import these WHERE they are used... NOT here.
import 'firebaseui/dist/firebaseui.css';
// import 'toastr/build/toastr.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import 'summernote/dist/summernote-lite.css';

const log = Logger.create();

async function start() {

    console.log("Starting logging init");
    await Logging.init();
    console.log("Starting logging init... done");

    await new Repository().start();

}

start()
    .catch(err => log.error("Could not start repository app: ", err));

