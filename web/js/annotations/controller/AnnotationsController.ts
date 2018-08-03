import {
    DialogWindowOptions,
    Resource,
    ResourceType
} from '../../ui/dialog_window/DialogWindow';
import {DialogWindowClient} from '../../ui/dialog_window/DialogWindowClient';
import {Logger} from '../../logger/Logger';
import {TriggerEvent} from '../../contextmenu/TriggerEvent';
import {CreateFlashcardRequest} from '../../apps/card_creator/CreateFlashcardRequest';
import {Optional} from '../../util/ts/Optional';
import {Nullable} from '../../util/ts/Nullable';

const log = Logger.create();

/**
 * Controller used to listen for the context menu (and key bindings) for creating
 * specific annotation types.
 *
 * @ElectronMainContext
 */
export class AnnotationsController {

    flashcardDialogWindow = new Nullable<DialogWindowClient>();

    async start(): Promise<void> {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

        this.flashcardDialogWindow.set(await this.createFlashcardDialogWindow());

    }

    private onMessageReceived(event: any) {

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

        await this.flashcardDialogWindow.get().show();

    }

    private async createFlashcardDialogWindow(): Promise<DialogWindowClient> {

        let appPath = "./apps/card-creator/index.html";

        let resource = new Resource(ResourceType.FILE, appPath);
        let options = new DialogWindowOptions(resource);
        options.show = false;

        return await DialogWindowClient.create(options);

    }

}
