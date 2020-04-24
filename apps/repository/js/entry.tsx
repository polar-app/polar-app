import * as React from 'react';
import {RepositoryApp} from '../../../web/js/apps/repository/RepositoryApp';
import {Logging} from '../../../web/js/logger/Logging';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Repository} from "../../../web/js/apps/repository/Repository";

const log = Logger.create();

async function start() {

    await Logging.init();

    await new Repository().start();

}

start()
    .catch(err => log.error("Could not start repository app: ", err));
