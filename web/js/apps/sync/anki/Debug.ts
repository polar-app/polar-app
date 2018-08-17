import {Logger} from '../../../logger/Logger';
import {AnkiSyncEngine} from './AnkiSyncEngine';

const log = Logger.create();

async function exec() {

    // create a fake DocMeta with flashcards and sync it to Anki and see if it
    // works



    new AnkiSyncEngine()

}

exec()
    .then(() => log.info("done"))
    .catch(err => log.error("Failed: ", err));
