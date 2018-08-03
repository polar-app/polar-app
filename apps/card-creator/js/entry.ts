import {CardCreatorApp} from '../../../web/js/apps/card_creator/CardCreatorApp';
import {Logger} from '../../../web/js/logger/Logger';

const log = Logger.create();

let cardCreatorApp = new CardCreatorApp();

cardCreatorApp.start()
    .catch(err => log.error("Could not start app: ", err));
