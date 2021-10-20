import {IDocMeta} from "./IDocMeta";
import {PagemarkType} from "./PagemarkType";
import {DocMetas} from "polar-bookshelf/web/js/metadata/DocMetas";
import {DocMetaSerializer} from "./DocMetaSerializer";
import {TextHighlights} from "./TextHighlights";
import {Pagemarks} from "./Pagemarks";

export namespace MockDocMetas {


    /**
     * Create a DocMeta object but place initial pagemarks on it. This is useful
     * for testing.
     *
     */
    export function createWithinInitialPagemarks(fingerprint: string, nrPages: number): IDocMeta {

        const result = DocMetaSerializer.create(fingerprint, nrPages);

        const maxPages = 3;
        for (let pageNum = 1; pageNum <= Math.min(nrPages, maxPages); ++pageNum) {

            const pagemark = Pagemarks.create({
                type: PagemarkType.SINGLE_COLUMN,
                percentage: 100,
                column: 0
            });

            Pagemarks.updatePagemark(result, pageNum, pagemark);

        }

        return result;

    }

    export function createMockDocMeta(fingerprint: string = "0x001") {

        const nrPages = 4;
        const docMeta = createWithinInitialPagemarks(fingerprint, nrPages);

        const textHighlight = TextHighlights.createMockTextHighlight();

        DocMetas.getPageMeta(docMeta, 1).textHighlights[textHighlight.id] = textHighlight;

        return docMeta;

    }

}
