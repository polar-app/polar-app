import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";


export class DocMetaTransformer {

    /**
     * Transform one DocMeta to another DocMeta.  This is just a stopgap until
     * we migrate everything to react which will make this irrelevant.
     */
    public static transform(source: IDocMeta, target: IDocMeta) {

        const syncDocInfo = () => {

            // copy the docInfo properties from the source to the target
            // Object.assign(source.docInfo, target.docInfo);

            copyDict(source.docInfo, target.docInfo);

        };

        const syncAnnotations = () => {

            const syncPageMeta = (source: IPageMeta, target: IPageMeta) => {
                // pagemarks and reading progress should not be copied over.

                copyDict(source.textHighlights, target.textHighlights);
                copyDict(source.areaHighlights, target.areaHighlights);
                copyDict(source.notes, target.notes);
                copyDict(source.comments, target.comments);
                copyDict(source.questions, target.questions);
                copyDict(source.flashcards, target.flashcards);

            };

            for (const key of Dictionaries.numberKeys(source.pageMetas)) {

                const sourcePageMeta = source.pageMetas[key];
                const targetPageMeta = target.pageMetas[key];
                syncPageMeta(sourcePageMeta, targetPageMeta);

            }

        };

        syncDocInfo();
        syncAnnotations();

    }

}

interface StringDict {
    [key: string]: any;
}

const copyDict = (source: StringDict, target: StringDict) => {

    if (! source || ! target) {
        // not sure this is always the best strategy as if source is null
        // then target shouldn't be defined but I can't undefine it in the
        // source
        return;
    }

    for (const key of Object.keys(source)) {
        target[key] = source[key];
    }

};
