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

                let createFlashcardForm = new CreateFlashcardForm();

                let createFlashcardService = new CreateFlashcardService(createFlashcardForm);

                let schemaFormElement = <HTMLElement>document.getElementById('schema-form');

                createFlashcardForm.create(schemaFormElement);

                await createFlashcardService.start();
                resolve();

                log.info("UI created.")

            });

        });
    }

}
