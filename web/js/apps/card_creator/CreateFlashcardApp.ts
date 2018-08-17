import $ from '../../ui/JQuery';

import {CreateFlashcardForm} from './elements/schemaform/CreateFlashcardForm';
import {Logger} from '../../logger/Logger';
import {CreateFlashcardService} from './CreateFlashcardService';

const log = Logger.create();

export class CreateFlashcardApp {

    async start() {

        return new Promise<void>( resolve => {

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
