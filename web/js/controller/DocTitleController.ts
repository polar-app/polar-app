/**
 * Handles attaching events to the title UI and prompting for new titles.
 */
import {DocumentLoadedEvent, Model} from '../Model';
import {Strings} from '../util/Strings';
import {Logger} from '../logger/Logger';
import {Toaster} from '../toaster/Toaster';

const log = Logger.create();

export class DocTitleController {

    private readonly model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    start() {

        this.listenForDocumentLoad();
        this.listenForTitle();

        // TODO listen to paste so that if they paste \n so we escape it...

    }

    listenForDocumentLoad() {

        this.model.registerListenerForDocumentLoaded(async event => {
            await this.onDocumentLoaded(event);
        });

    }

    listenForTitle() {

        // bind to keyDown so I can listen for enter to change the title

        let inputElement = <HTMLElement>document.querySelector("#set-title input")!;
        inputElement.addEventListener('keydown', (event: KeyboardEvent) => {

            if( event.key === 'Enter') {
                log.info("Updating document metadata now");
                this.doUpdateTitle();
                this.hideTitlePrompt();
            }

        });

    }

    async onDocumentLoaded(event: DocumentLoadedEvent) {

        if(Strings.empty(event.docMeta.docInfo.title)) {
            this.triggerTitlePrompt();
        }

    }

    doUpdateTitle() {

        let inputElement = <HTMLInputElement>document.querySelector("#set-title input")!;

        let title = inputElement.value;

        log.info("Setting title to: " + title);

        this.model.docMeta.docInfo.title = title;

        Toaster.success("Document title successfully updated");

    }

    triggerTitlePrompt() {

        log.info("Triggering title prompt");
        this.showTitlePrompt();

    }

    hideTitlePrompt() {
        $('#set-title').hide();

    }

    showTitlePrompt() {
        $('#set-title').show();
    }

}
