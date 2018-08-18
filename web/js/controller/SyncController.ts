import {TriggerEvent} from '../contextmenu/TriggerEvent';
import {Logger} from '../logger/Logger';

const log = Logger.create();

export class SyncController {

    start() {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

    }

    onMessageReceived(event: any) {

        log.info("Received message: ", event);

        let triggerEvent = event.data;

        switch(event.data.type) {

            case "start-sync":
                this.onStartSync(triggerEvent);
                break;

        }

    }

    onStartSync(triggerEvent: TriggerEvent){
        console.log("Sync started...");
    }

}
