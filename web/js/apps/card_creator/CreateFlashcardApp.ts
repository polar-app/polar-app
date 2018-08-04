import $ from '../../ui/JQuery';

import {CreateFlashcardForm} from './elements/schemaform/CreateFlashcardForm';
import {Logger} from '../../logger/Logger';
import {CreateFlashcardRequest} from './CreateFlashcardRequest';
import {CreateFlashcardService} from './CreateFlashcardService';

const log = Logger.create();

export class CreateFlashcardApp {

    async start() {

        return new Promise<void>( resolve => {

            $(document).ready(async function () {

                log.info("Ready to create flash card!");

                let createFlashcardForm = new CreateFlashcardForm();

                let createFlashcardService = new CreateFlashcardService(createFlashcardForm);

                let schemaFormElement = <HTMLElement>document.getElementById('schema-form');

                // FIXME: allow us to start with a blank UI now...

                // FIXME: we have to create one when we get a new request to create an annotation.
                //let postMessageFormHandler = new PostMessageFormHandler(createFlashcardRequest);

                createFlashcardForm.create(schemaFormElement);

                await createFlashcardService.start();
                resolve();

                log.info("UI created.")

            });

        });
    }

}

// TODO: this could/should be removed as I think we are done taking the requests
// via URL and now taking them via IPC.
class Context {

    public readonly createFlashcardRequest: CreateFlashcardRequest;

    constructor(createFlashcardRequest: CreateFlashcardRequest) {
        this.createFlashcardRequest = createFlashcardRequest;
    }

    static create() {

        let url = new URL(window.location.href);

        let json = url.searchParams.get('createFlashcardRequest');

        if (json) {
            return CreateFlashcardRequest.create(JSON.parse(json));
        } else {
            throw new Error("No createFlashcardRequest");
        }

    }

}
