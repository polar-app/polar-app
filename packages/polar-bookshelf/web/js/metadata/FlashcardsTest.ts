import {assertJSON} from '../test/Assertions';
import {Flashcards} from './Flashcards';
import {Texts} from 'polar-shared/src/metadata/Texts';
import {TextType} from 'polar-shared/src/metadata/TextType';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {Flashcard} from 'polar-shared/src/metadata/Flashcard';
import {TestingTime} from 'polar-shared/src/test/TestingTime';


describe('Flashcards', function() {

    const archetype = "9d146db1-7c31-4bcf-866b-7b485c4e50ea";

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    describe('create', function() {

        it("basic", function() {

            const text = Texts.create("This is the text", TextType.MARKDOWN);

            const fields = { text };

            const flashcard = Flashcards.create(FlashcardType.CLOZE, fields, archetype, 'page:1');

            const expected = {
                "id": "1TPGcJEaas",
                "guid": "1TPGcJEaas",
                "created": "2012-03-02T11:38:49.321Z",
                "lastUpdated": "2012-03-02T11:38:49.321Z",
                "type": "CLOZE",
                "fields": {
                    "text": {
                        "MARKDOWN": "This is the text"
                    }
                },
                "archetype": "9d146db1-7c31-4bcf-866b-7b485c4e50ea",
                "ref": "page:1"
            };

            assertJSON(flashcard, expected);

        });

    });

    describe('JSON', function() {

        it("serialize", function() {

            const text = Texts.create("This is the text", TextType.MARKDOWN);

            const fields = { text };

            const flashcard = Flashcards.create(FlashcardType.CLOZE, fields, archetype, 'page:1');

            const expected = {
                "id": "1TPGcJEaas",
                "guid": "1TPGcJEaas",
                "created": "2012-03-02T11:38:49.321Z",
                "lastUpdated": "2012-03-02T11:38:49.321Z",
                "type": "CLOZE",
                "fields": {
                    "text": {
                        "MARKDOWN": "This is the text"
                    }
                },
                "archetype": "9d146db1-7c31-4bcf-866b-7b485c4e50ea",
                "ref": "page:1"
            };

            assertJSON(flashcard, expected);

            const parsed = JSON.parse(JSON.stringify(flashcard));

            new Flashcard(<Flashcard> parsed);

        });

    });

});
