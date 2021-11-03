import {DocMetaSupplierCollection} from '../../../../metadata/DocMetaSupplierCollection';
import {FlashcardDescriptor} from './FlashcardDescriptor';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {arrayStream} from 'polar-shared/src/util/ArrayStreams';
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";

export class FlashcardDescriptors {

    public static async toFlashcardDescriptors(docMetaSupplierCollection: DocMetaSupplierCollection): Promise<FlashcardDescriptor[]> {

        const result: FlashcardDescriptor[] = [];

        for (const docMetaSupplier of docMetaSupplierCollection) {

            try {

                const docMeta = await docMetaSupplier();

                const pageMetaToFlashcardDescriptors = (pageMeta: IPageMeta): ReadonlyArray<FlashcardDescriptor> => {

                    // collect all flashcards for the current page.

                    function computeFlashcards(): ReadonlyArray<IFlashcard> {

                        const flashcards = Object.values(pageMeta.flashcards)

                        const textHighlightFlashcards
                            = arrayStream(Object.values(pageMeta.textHighlights))
                            .map(current => Object.values(current.flashcards))
                            .flatMap(current => current)
                            .collect()

                        const areaHighlightFlashcards
                            = arrayStream(Object.values(pageMeta.areaHighlights))
                            .map(current => Object.values(current.flashcards))
                            .flatMap(current => current)
                            .collect()

                        return [
                            ...flashcards,
                            ...textHighlightFlashcards,
                            ...areaHighlightFlashcards
                        ];

                    }

                    const flashcards = computeFlashcards();

                    return flashcards.map(current => <FlashcardDescriptor> {
                        docMeta,
                        pageInfo: pageMeta.pageInfo,
                        flashcard: current
                    });

                }

                const flashcardDescriptors
                    = arrayStream(Object.values(docMeta.pageMetas))
                        .map(pageMetaToFlashcardDescriptors)
                        .flatMap(current => current)
                        .collect();

                result.push(...flashcardDescriptors);

            } catch (e) {
                console.error("Unable to handle docMeta: ", e);
            }

        }

        return result;

    }

    public static toModelName(flashcardDescriptor: FlashcardDescriptor) {

        if (flashcardDescriptor.flashcard.type === FlashcardType.CLOZE) {
            return "Cloze";
        }

        return "Basic";

    }

}
