import {StartCaptureApp} from "../../../../web/js/capture/controller/StartCaptureApp";
import {Logger} from '../../../../web/js/logger/Logger';

const log = Logger.create();

async function start() {

    await Logger.init();

    new StartCaptureApp().start();

}

start().catch(err => log.error("Could not start app: ", err));
