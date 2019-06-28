import {DocMeta} from './DocMeta';
import {Dictionaries} from '../util/Dictionaries';
import {PageMeta} from './PageMeta';

export class DocMetaMerger {

    public static merge(primary: DocMeta, ...secondaries: ReadonlyArray<DocMeta>) {

        // the primary contains the main document changes.

        // the secondary docMetas contain what we need to merge/copy over.
        const result = <DocMeta> Dictionaries.deepCopy(primary);

        for (const secondary of secondaries) {

            deepCopyInto(result.attachments, secondary.attachments);

            for (const key of Object.keys(primary.pageMetas)) {

                const src = primary.pageMetas[key];
                const dest = result.pageMetas[key];
                deepCopyPageMeta(src, dest);

            }

        }

        return result;

    }

}

function deepCopyPageMeta(src: PageMeta, dest: PageMeta) {
    // pagemarks and reading progress should not be copied over.

    deepCopyInto(src.textHighlights, dest.textHighlights);
    deepCopyInto(src.areaHighlights, dest.areaHighlights);
    deepCopyInto(src.notes, dest.notes);
    deepCopyInto(src.comments, dest.comments);
    deepCopyInto(src.questions, dest.questions);
    deepCopyInto(src.flashcards, dest.flashcards);

}

function deepCopyInto(src: ObjectMap, target: ObjectMap) {

    if (! src) {
        return;
    }

    for (const key of Object.keys(src)) {
        target[key] = src[key];
    }

}

interface ObjectMap {
    [key: string]: object;
}

