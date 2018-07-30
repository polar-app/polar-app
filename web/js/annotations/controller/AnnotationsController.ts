import {DialogWindow, DialogWindowOptions, Resource, ResourceType} from '../../ui/dialog_window/DialogWindow';
import {DialogWindowClient} from '../../ui/dialog_window/DialogWindowClient';
import {Logger} from '../../logger/Logger';
import {Point} from '../../Point';
import {TriggerEvent} from '../../contextmenu/TriggerEvent';

const log = Logger.create();

export class AnnotationsController {

    //private dialogWindow: DialogWindow;
    async start() {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

    }

    async createDialogWindow() {

        // FIXME: we're not including the context that we need

        let appPath = "./apps/card-creator/index.html";
        let resource = new Resource(ResourceType.FILE, appPath);
        let options = new DialogWindowOptions(resource);

        let dialogWindowClient = new DialogWindowClient();
        await  dialogWindowClient.create(options);
    }

    onMessageReceived(event: any) {

        // get the page number

        let data = event.data;

        if(data) {

            if(data.type === 'create-flashcard') {

                console.log("FIXME: got event data" , event.data);

                let triggerEvent = TriggerEvent.create(event.data);

                console.log("FIXME: built trigger event: " , triggerEvent);

                let matchingSelectors = triggerEvent.matchingSelectors;
                let matchingSelector = matchingSelectors[".page"];

                let pageNum: number = matchingSelector.annotationDescriptors[0].pageNumber;

                console.log("FIXME: passing trigger event: " , triggerEvent);

                // FIXME: this is the bug... when the triggerEvent value is getting to
                // createFlashcard it's just a plain {} with no data.

                this.createFlashcard(triggerEvent, pageNum, data.points.pageOffset)
                    .catch(err => log.error("Could not create flashcard: ", err));

            }

        }

    }

    /**
     * Create a new flashcard.
     */
    async createFlashcard(triggerEvent: TriggerEvent, pageNum: number, pageOffset: Point) {
        log.info("Creating flashcard with triggerEvent: ", triggerEvent);
    }

}
