import {ContentCaptureApp} from '../../../web/js/capture/renderer/ContentCaptureApp';
import {Logger} from '../../../web/js/logger/Logger';

const log = Logger.create();

async function start() {

    await Logger.init();

    let contentCaptureApp = new ContentCaptureApp();
    await contentCaptureApp.start();

}

start().catch(err => log.error("Could not start app: ", err));
