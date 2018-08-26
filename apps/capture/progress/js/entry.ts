import {ProgressApp} from "../../../../web/js/capture/controller/ProgressApp";
import {Logger} from '../../../../web/js/logger/Logger';

const log = Logger.create();

async function start() {

    await Logger.init();

    new ProgressApp().start();

}

start().catch(err => log.error("Could not start app: ", err));
