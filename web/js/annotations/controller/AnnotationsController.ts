import {DialogWindowOptions, Resource, ResourceType} from '../../ui/dialog_window/DialogWindow';
import {DialogWindowClient} from '../../ui/dialog_window/DialogWindowClient';
import {Logger} from '../../logger/Logger';
import {TriggerEvent} from '../../contextmenu/TriggerEvent';
import {Nullable} from '../../util/ts/Nullable';
import {AnnotationTriggerEvents} from './AnnotationTriggerEvents';
import {IPCEngine} from '../../ipc/handler/IPCEngine';
import {IPCClient} from '../../ipc/handler/IPCClient';
import {ElectronIPCEvent} from '../../ipc/handler/ElectronIPCEvent';
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

        // TODO this doesn't work because the dialog window sends responses to
        // its main process NOT the IPC client here.
        this.ipcClient.set(new IPCClient(new ElectronIPCPipe(dialogWindowClient.createPipe())));

    }

    private onMessageReceived(event: any) {

        let data = event.data;

        // TODO: refactor this to use IPC and make the api have
        // /api/context-menu in it so that it's obvious that we're responding
        // to context menu events

        if(data) {

            if(data.type === 'create-flashcard') {

                let triggerEvent = TriggerEvent.create(event.data);

                log.info("Creating flashcard from trigger event: ", triggerEvent);

                //FIXME: add this back in,... let createFlashcardRequest = new CreateFlashcardRequest(triggerEvent.docDescriptor);

                // TODO: narrow this down to the right annotation were creating
                // this with and also attach the

                this.createFlashcard(triggerEvent)
                    .catch(err => log.error("Could not create flashcard: ", err));

            }

        }

    }

    /**
     * Create a new flashcard.
     */
    private async createFlashcard(triggerEvent: TriggerEvent) {

        // find the text / area highlight this was created on...

        // FIXME: now send a message to the card creator that we're going to
        // create a new flashcard.

        //log.info("Creating flashcard with triggerEvent: ", createFlashcardRequest);

        // we need to tell the annotation controller about the new highlight.

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

        // TODO: we're not awaiting the response now because the IPC framework
        // is somewhat broken regarding channels and I need to rethink them
        // and write test frameworks for this functionality.
        this.ipcClient.get().execute('/create-flashcard/api/create', annotationDescriptor);
        log.info("Sending annotation descriptor...done");

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
