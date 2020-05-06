import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {ClozeFields, FrontAndBackFields} from './flashcard_input/FlashcardInputs';
import {DocAnnotation, IDocAnnotation} from '../../DocAnnotation';
import {Functions} from 'polar-shared/src/util/Functions';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Flashcard} from '../../../metadata/Flashcard';
import {Refs} from 'polar-shared/src/metadata/Refs';
import {Flashcards} from '../../../metadata/Flashcards';
import {DocMetas} from '../../../metadata/DocMetas';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

const log = Logger.create();

export class FlashcardActions {

    public static create(parent: IDocAnnotation,
                         type: FlashcardType,
                         fields: FrontAndBackFields | ClozeFields) {

        Functions.withTimeout(() => {

            const flashcard = this.newInstance(parent, type, fields);

            if (flashcard) {
                parent.pageMeta.flashcards[flashcard.id] = Flashcards.createMutable(flashcard);
            }

        });

    }

    public static update(docMeta: IDocMeta,
                         parent: IDocAnnotation,
                         type: FlashcardType,
                         fields: FrontAndBackFields | ClozeFields,
                         existingFlashcard?: Flashcard | IDocAnnotation) {

        const flashcard = this.newInstance(parent, type, fields);

        if (flashcard) {

            DocMetas.withBatchedMutations(docMeta, () => {

                if (existingFlashcard) {
                    delete parent.pageMeta.flashcards[existingFlashcard.id];
                }

                parent.pageMeta.flashcards[flashcard.id] = <Flashcard> {...flashcard};

            });

        }

    }

    public static delete(docMeta: IDocMeta,
                         parent: IDocAnnotation,
                         existing: Flashcard | IDocAnnotation) {

        DocMetas.withBatchedMutations(docMeta, () => {
            delete parent.pageMeta.flashcards[existing.id];
        });

    }

    /**
     * Create a new instance from the given fields.
     */
    private static newInstance(parent: IDocAnnotation,
                               type: FlashcardType,
                               fields: FrontAndBackFields | ClozeFields): Flashcard | undefined {

        const ref = Refs.createFromAnnotationType(parent.id, parent.annotationType);

        if (type === FlashcardType.BASIC_FRONT_BACK) {

            const frontAndBackFields = fields as FrontAndBackFields;
            const {front, back} = frontAndBackFields;

            return Flashcards.createFrontBack(front, back, ref);

        }

        if (type === FlashcardType.CLOZE) {

            const clozeFields = fields as ClozeFields;
            const {text} = clozeFields;

            return Flashcards.createCloze(text, ref);

        }

        return undefined;

    }

}
