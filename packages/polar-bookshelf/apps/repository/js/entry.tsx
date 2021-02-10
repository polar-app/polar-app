import * as React from 'react';
import {Logging} from '../../../web/js/logger/Logging';
import {Repository} from "../../../web/js/apps/repository/Repository";

async function start() {

    console.log("Starting logging init");
    await Logging.init();
    console.log("Starting logging init... done");

    await new Repository().start();

}

start()
    .catch(err => console.error("Could not start repository app: ", err));


