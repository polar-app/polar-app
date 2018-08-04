import {Logger} from '../../../logger/Logger';
import {SchemaFormData} from '../elements/schemaform/SchemaFormData';
import {Flashcard} from '../../../metadata/Flashcard';
import {Flashcards} from '../../../metadata/Flashcards';

const log = Logger.create();

export class SchemaFormFlashcardConverter {

    static convert(schemaFormData: SchemaFormData, archetype: string): Flashcard {

        log.info("Converting SchemaFormData: ", schemaFormData);

        return Flashcards.createFromSchemaFormData(schemaFormData.formData, archetype);

    }

}
