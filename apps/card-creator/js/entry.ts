import {Entry} from '../../../web/js/apps/card_creator/Entry';
import {Logger} from '../../../web/js/logger/Logger';

const log = Logger.create();

let entry = new Entry();

entry.start()
    .catch(err => log.error("Could not start app: ", err));
