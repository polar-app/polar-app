import {Logger} from '../../../web/js/logger/Logger';
import {SyncApp} from "../../../web/js/apps/sync/SyncApp";

const log = Logger.create();

async function start() {

    await Logger.init();

    let app = new SyncApp();
    await app.start()

}

start().catch(err => log.error("Could not start app: ", err));
