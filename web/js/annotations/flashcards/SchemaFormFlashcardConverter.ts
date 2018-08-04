import {Flashcards} from '../../metadata/Flashcards';
import {Flashcard} from '../../metadata/Flashcard';
import {Logger} from '../../logger/Logger';
import {SchemaFormData} from '../elements/schemaform/SchemaFormData';

const log = Logger.create();

export class SchemaFormFlashcardConverter {

    static convert(schemaFormData: SchemaFormData, archetype: string): Flashcard {

        log.info("converting SchemaFormData: ", schemaFormData);

        return Flashcards.createFromSchemaFormData(schemaFormData.formData, archetype);

    }

}
