import {Logger} from '../../../web/js/logger/Logger';
import {SyncApp} from "../../../web/js/apps/sync/SyncApp";

const log = Logger.create();

let app = new SyncApp();

app.start()
   .catch(err => log.error("Could not start app: ", err));
