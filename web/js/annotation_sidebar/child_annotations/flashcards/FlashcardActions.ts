import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {
    ClozeFields,
    FrontAndBackFields
} from './flashcard_input/FlashcardInputs';
import {IDocAnnotation, IDocAnnotationRef} from '../../DocAnnotation';
import {Functions} from 'polar-shared/src/util/Functions';
import {Flashcard} from '../../../metadata/Flashcard';
import {IRef, Refs} from 'polar-shared/src/metadata/Refs';
import {Flashcards} from '../../../metadata/Flashcards';
import {DocMetas} from '../../../metadata/DocMetas';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";

export class FlashcardActions {

    public static create(parent: IRef,
                         pageMeta: IPageMeta,
                         type: FlashcardType,
                         fields: FrontAndBackFields | ClozeFields) {

        Functions.withTimeout(() => {

            const flashcard = this.newInstanceFromParentRef(parent, type, fields);

            if (flashcard) {
                pageMeta.flashcards[flashcard.id] = Flashcards.createMutable(flashcard);
            }

        });

    }

    public static update(docMeta: IDocMeta,
                         pageMeta: IPageMeta,
                         parent: IRef,
                         type: FlashcardType,
                         fields: FrontAndBackFields | ClozeFields,
                         existingFlashcard?: IFlashcard | IDocAnnotationRef) {

        const flashcard = this.newInstanceFromParentRef(parent, type, fields);

        if (flashcard) {

            DocMetas.withBatchedMutations(docMeta, () => {

                if (existingFlashcard) {
                    delete pageMeta.flashcards[existingFlashcard.id];
                }

                pageMeta.flashcards[flashcard.id] = <Flashcard> {...flashcard};

            });

        }

    }

    public static delete(docMeta: IDocMeta,
                         pageMeta: IPageMeta,
                         parent: IRef,
                         existing: Flashcard | IDocAnnotation) {

        DocMetas.withBatchedMutations(docMeta, () => {
            delete pageMeta.flashcards[existing.id];
        });

    }

    /**
     * Create a new instance from the given fields.
     */
    private static newInstance(parent: IDocAnnotation,
                               type: FlashcardType,
                               fields: FrontAndBackFields | ClozeFields): Flashcard | undefined {

        const parentRef: IRef = {
            value: parent.id,
            type: Refs.toRefType(parent.annotationType)
        };

        return this.newInstanceFromParentRef(parentRef, type, fields)

    }

    private static newInstanceFromParentRef(parent: IRef,
                                            type: FlashcardType,
                                            fields: FrontAndBackFields | ClozeFields): Flashcard | undefined {

        const ref = Refs.create(parent.value, parent.type);

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
