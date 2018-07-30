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

    async start() {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

        await this.createDialogWindow();

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

        // FIXME: we now need to send a message to the other window telling it
        // to create a new flashcard.  We also need to tell it to show itself.
    }

    private async createDialogWindow(): Promise<DialogWindowClient> {

        let appPath = "./apps/card-creator/index.html";

        let resource = new Resource(ResourceType.FILE, appPath);
        let options = new DialogWindowOptions(resource);
        options.show = true;

        return await DialogWindowClient.create(options);

    }

}
