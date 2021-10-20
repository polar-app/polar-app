import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Pagemarks} from "./Pagemarks";
import {PagemarkType} from "polar-shared/src/metadata/PagemarkType";
import {TextHighlights} from "./TextHighlights";
import {Datastore} from "../datastore/Datastore";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {Backend} from "polar-shared/src/datastore/Backend";
import {DocMetas, MockDoc} from "./DocMetas";

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

    public static async createMockDocMetaFromPDF(datastore: Datastore): Promise<MockDoc> {

        const docMeta = MockDocMetas.createMockDocMeta();

        const pdfPath = FilePaths.join(__dirname, "..", "..", "..", "docs", "examples", "pdf", "chubby.pdf");

        const fileRef: FileRef = {
            name: "chubby.pdf"
        };

        docMeta.docInfo.filename = fileRef.name;
        docMeta.docInfo.backend = Backend.STASH;

        await datastore.writeFile(Backend.STASH, fileRef, {path: pdfPath});

        await datastore.writeDocMeta(docMeta);

        const result: MockDoc = {
            docMeta, fileRef
        };

        return result;

    }


}
