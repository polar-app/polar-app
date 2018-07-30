import $ from '../../ui/JQuery';

import {InputController} from '../../annotations/elements/schemaform/InputController';
import {PostMessageFormHandler} from '../../annotations/flashcards/PostMessageFormHandler';
import {Logger} from '../../logger/Logger';
import {CreateFlashcardRequest} from './CreateFlashcardRequest';

const log = Logger.create();

export class Entry {

    async start() {

        return new Promise<void>( resolve => {
            $(document).ready(function () {

                console.log("Ready to create flash card!");

                let createFlashcardRequest = Context.create();

                let inputController = new InputController();

                let schemaFormElement = <HTMLElement>document.getElementById('schema-form');

                let postMessageFormHandler = new PostMessageFormHandler(createFlashcardRequest);

                inputController.createNewFlashcard(schemaFormElement, postMessageFormHandler);

                resolve();

            })
        });
    }

}

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
