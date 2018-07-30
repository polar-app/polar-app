import {
    DialogWindowOptions,
    Resource,
    ResourceType
} from '../../ui/dialog_window/DialogWindow';
import {DialogWindowClient} from '../../ui/dialog_window/DialogWindowClient';
import {Logger} from '../../logger/Logger';
import {TriggerEvent} from '../../contextmenu/TriggerEvent';
import {CreateFlashcardRequest} from '../../apps/card_creator/CreateFlashcardRequest';

const log = Logger.create();

export class AnnotationsController {

    //private dialogWindow: DialogWindow;
    async start() {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

    }

    private onMessageReceived(event: any) {

        // get the page number

        let data = event.data;

        if(data) {

            if(data.type === 'create-flashcard') {

                let triggerEvent = TriggerEvent.create(event.data);

                let createFlashcardRequest = new CreateFlashcardRequest(triggerEvent.docDescriptor);

                this.createFlashcard(createFlashcardRequest)
                    .catch(err => log.error("Could not create flashcard: ", err));

            }

        }

    }

    /**
     * Create a new flashcard.
     */
    private async createFlashcard(createFlashcardRequest: CreateFlashcardRequest) {
        log.info("Creating flashcard with triggerEvent: ", createFlashcardRequest);
        await this.createDialogWindow(createFlashcardRequest);
    }

    private async createDialogWindow(createFlashcardRequest: CreateFlashcardRequest) {

        let createFlashcardRequestJSON = JSON.stringify(createFlashcardRequest);

        // FIXME: this sucks because it can'd load a file with a query param..
        let appPath = "./apps/card-creator/index.html?createFlashcardRequest=" + encodeURIComponent(createFlashcardRequestJSON);

        let resource = new Resource(ResourceType.FILE, appPath);
        let options = new DialogWindowOptions(resource);

        let dialogWindowClient = new DialogWindowClient();
        await dialogWindowClient.create(options);
    }

}
