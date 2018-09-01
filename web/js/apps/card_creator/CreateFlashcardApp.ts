import $ from '../../ui/JQuery';

import {CreateFlashcardForm} from './elements/schemaform/CreateFlashcardForm';
import {Logger} from '../../logger/Logger';
import {CreateFlashcardService} from './CreateFlashcardService';
import {DocumentReadyStates} from '../../util/dom/DocumentReadyStates';

const log = Logger.create();

export class CreateFlashcardApp {

    async start() {

        return new Promise<void>( resolve => {

            // TODO: move this to DocumentReadyStates and not jquery.
            $(document).ready(async function () {

                log.info("Ready to create flash card!");

                let schemaFormElement = <HTMLElement>document.getElementById('schema-form');

                let createFlashcardForm = new CreateFlashcardForm(schemaFormElement);

                let createFlashcardService = new CreateFlashcardService(createFlashcardForm);

                await createFlashcardService.start();
                resolve();

                log.info("UI created.")

            });

        });
    }

}
