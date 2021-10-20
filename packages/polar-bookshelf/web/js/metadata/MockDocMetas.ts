import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Pagemarks} from "./Pagemarks";
import {PagemarkType} from "polar-shared/src/metadata/PagemarkType";
import {TextHighlights} from "./TextHighlights";
import {DocMetas} from "./DocMetas";

export class MockDocMetas {


    /**
     * Create a DocMeta object but place initial pagemarks on it. This is useful
     * for testing.
     *
     */
    public static createWithinInitialPagemarks(fingerprint: string, nrPages: number): IDocMeta {

        const result = DocMetas.create(fingerprint, nrPages);

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

    public static createMockDocMeta(fingerprint: string = "0x001") {

        const nrPages = 4;
        const docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, nrPages);

        const textHighlight = TextHighlights.createMockTextHighlight();

        DocMetas.getPageMeta(docMeta, 1).textHighlights[textHighlight.id] = textHighlight;

        return docMeta;

    }

}
