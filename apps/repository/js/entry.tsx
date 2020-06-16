import * as React from 'react';
import {Logging} from '../../../web/js/logger/Logging';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Repository} from "../../../web/js/apps/repository/Repository";

const log = Logger.create();

import "../css/fontawesome.scss"

async function start() {

    console.log("Starting logging init");
    await Logging.init();
    console.log("Starting logging init... done");

    await new Repository().start();

}

start()
    .catch(err => log.error("Could not start repository app: ", err));

