import {DialogWindowOptions, Resource, ResourceType} from '../../ui/dialog_window/DialogWindow';
import {DialogWindowClient} from '../../ui/dialog_window/DialogWindowClient';
import {Logger} from '../../logger/Logger';
import {TriggerEvent} from '../../contextmenu/TriggerEvent';
import {Nullable} from '../../util/ts/Nullable';
import {AnnotationTriggerEvents} from './AnnotationTriggerEvents';
import {IPCClient} from '../../ipc/handler/IPCClient';
import {IPCEvent} from '../../ipc/handler/IPCEvent';
import {ElectronIPCPipe} from '../../ipc/handler/ElectronIPCPipe';

const log = Logger.create();

/**
 * Controller used to listen for the context menu (and key bindings) for
 * creating specific annotation types.
 *
 * @ElectronMainContext
 */
export class AnnotationsController {

    flashcardDialogWindow = new Nullable<DialogWindowClient>();

    ipcClient = new Nullable<IPCClient<IPCEvent>>();

    async start(): Promise<void> {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

        let dialogWindowClient = await this.createFlashcardDialogWindow();
        this.flashcardDialogWindow.set(dialogWindowClient);

        this.ipcClient.set(dialogWindowClient.createClient());

    }

    private onMessageReceived(event: any) {

        let data = event.data;

        // TODO: refactor this to use IPC and make the api have
        // /api/context-menu in it so that it's obvious that we're responding
        // to context menu events

        if(data) {

            if(data.type === 'add-flashcard') {

                let triggerEvent = TriggerEvent.create(event.data);

                log.info("Creating flashcard from trigger event: ", triggerEvent);

                this.createFlashcard(triggerEvent)
                    .catch(err => log.error("Could not create flashcard: ", err));

            }

        }

    }

    /**
     * Create a new flashcard.
     */
    private async createFlashcard(triggerEvent: TriggerEvent) {

        await this.showDialog();
        await this.sendAnnotationDescriptor(triggerEvent);

        log.info("Flashcard UI created successfully.");

    }

    private async sendAnnotationDescriptor(triggerEvent: TriggerEvent) {

        log.info("Sending annotation descriptor...");

        let annotationDescriptors
            = AnnotationTriggerEvents.getAnnotationDescriptors(triggerEvent);

        if(annotationDescriptors.length == 0)
            return;

        let annotationDescriptor = annotationDescriptors[0];

        this.ipcClient.get().execute('/create-flashcard/api/create', annotationDescriptor)
            .then(() => {

                log.info("Sending annotation descriptor...done");

            });

    }

    private async showDialog() {
        log.info("Showing dialog...");
        await this.flashcardDialogWindow.get().show();
        log.info("Showing dialog...done");
    }

    private async createFlashcardDialogWindow(): Promise<DialogWindowClient> {

        let appPath = "./apps/card-creator/index.html";

        let resource = new Resource(ResourceType.FILE, appPath);
        let options = new DialogWindowOptions(resource);
        options.show = false;

        return await DialogWindowClient.create(options);

    }

}
