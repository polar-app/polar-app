import {TriggerEvent} from '../contextmenu/TriggerEvent';
import {Logger} from '../logger/Logger';
import {Model} from '../Model';
import {Strings} from '../util/Strings';
import {Toaster} from '../toaster/Toaster';

const log = Logger.create();

export class SyncController {

    private readonly model: Model;

    constructor(model: Model) {
        this.model = model;
    }

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

        // TODO: verify that the document has a title.

        if(Strings.empty(this.model.docMeta.docInfo.title)) {
            Toaster.error("Documents must have titles before we can synchronize." , "Sync Error");
        }

        console.log("Sync started...");
    }

}
