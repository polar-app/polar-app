import { FlashcardExportRequest } from "./FlashCardsExportFunction";
import { FlashCardExport } from "polar-anki-export/src/FlashCardExport";
import { FirebaseAdmin } from "polar-firebase-admin/src/FirebaseAdmin";
import { BlockCollection } from "polar-firebase/src/firebase/om/BlockCollection";
import { AnnotationContentType, IAnnotationContent } from "polar-blocks/src/blocks/content/IAnnotationContent";
import { IBlockFlashcard } from "polar-blocks/src/annotations/IBlockFlashcard";
import { FlashcardType } from "polar-shared/src/metadata/FlashcardType";
import { FilePaths } from "polar-shared/src/util/FilePaths";
import { PathStr, UserIDStr } from "polar-shared/src/util/Strings";
import { IBlock, BlockIDStr } from "polar-blocks/src/blocks/IBlock";

export namespace AnkiExport {

    export async function fetchUserBlocks(blockIDs: ReadonlyArray<BlockIDStr>) {
        return FirebaseAdmin.app()
            .firestore()
            .collection(BlockCollection.COLLECTION)
            .where('id', 'in', blockIDs)
            .get();
    }

    /**
     * 
     * @param request Flashcard export request
     * @param uid user id 
     * @returns generated apkg file path
     */
    export async function create(request: FlashcardExportRequest, uid: UserIDStr): Promise<PathStr> {

        const flashCardExport = FlashCardExport.init(request.ankiDeckName);

        const docs = await fetchUserBlocks(request.blockIDs);


        // Converting blocks to Anki flashcards based on type
        docs.forEach(
            (doc: FirebaseFirestore.DocumentData ) => {
                const block = doc.data() as IBlock<IAnnotationContent>;

                // Skip blocks that the user doesn't have access to
                // Or any block that isn't a flashcard
                if ( block.uid !== uid || block.content.type !== AnnotationContentType.FLASHCARD ) {
                    return;
                }

                const flashcard = block.content.value as IBlockFlashcard;

                switch (flashcard.type) {
                    case FlashcardType.CLOZE:
                        flashCardExport.addCloze(flashcard.fields.text);
                        break;
                    // The following three types get the same treatment
                    // and we currently only support BASIC_FRONT_BACK
                    // users can't actually create a flashcard of the other two types
                    case FlashcardType.BASIC_FRONT_BACK_AND_REVERSE:
                    case FlashcardType.BASIC_FRONT_BACK_OR_REVERSE:
                    case FlashcardType.BASIC_FRONT_BACK:
                        flashCardExport.addBasic(flashcard.fields.front, flashcard.fields.back);
                        break;
                    default:
                        console.error("Undefined flashcard type")
                        break;
                }
            }
        );

        return flashCardExport.save(FilePaths.tmpdir());
    }
}