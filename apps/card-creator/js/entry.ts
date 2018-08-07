import {CreateFlashcardApp} from '../../../web/js/apps/card_creator/CreateFlashcardApp';
import {Logger} from '../../../web/js/logger/Logger';

const log = Logger.create();

let cardCreatorApp = new CreateFlashcardApp();

cardCreatorApp.start()
    .catch(err => log.error("Could not start app: ", err));
