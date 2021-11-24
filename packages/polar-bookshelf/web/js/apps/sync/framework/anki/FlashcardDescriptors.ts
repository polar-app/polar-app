import {DocMetaSupplierCollection} from '../../../../metadata/DocMetaSupplierCollection';
import {FlashcardDescriptor} from './FlashcardDescriptor';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export class FlashcardDescriptors {

    public static async toFlashcardDescriptors(docMetaSupplierCollection: DocMetaSupplierCollection): Promise<FlashcardDescriptor[]> {

        const result: FlashcardDescriptor[] = [];

        for (const docMetaSupplier of docMetaSupplierCollection) {

            try {

                const docMeta = await docMetaSupplier();

                Object.values(docMeta.pageMetas).forEach(pageMeta => {

                    // collect all flashcards for the current page.

                    const mainFlashcards = Object.values(pageMeta.flashcards || {});

                    const textHighlightFlashcards =
                        arrayStream(Object.values(pageMeta.textHighlights || {}))
                            .map(current => Object.values(current.flashcards || {}))
                            .flatMap(current => current)
                            .collect();

                    const areaHighlightFlashcards =
                        arrayStream(Object.values(pageMeta.areaHighlights || {}))
                            .map(current => Object.values(current.flashcards || {}))
                            .flatMap(current => current)
                            .collect();

                    const flashcards = [...mainFlashcards, ...textHighlightFlashcards, ...areaHighlightFlashcards];

                    const flashcardDescriptors =
                        flashcards
                            .map(current => <FlashcardDescriptor> {
                                docMeta,
                                pageInfo: pageMeta.pageInfo,
                                flashcard: current
                            })

                    result.push(...flashcardDescriptors);

                });

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
