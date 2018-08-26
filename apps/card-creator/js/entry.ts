import {CreateFlashcardApp} from '../../../web/js/apps/card_creator/CreateFlashcardApp';
import {Logger} from '../../../web/js/logger/Logger';

const log = Logger.create();

async function start() {

    await Logger.init();

    let cardCreatorApp = new CreateFlashcardApp();
    await cardCreatorApp.start();

}

start().catch(err => log.error("Could not start app: ", err));
