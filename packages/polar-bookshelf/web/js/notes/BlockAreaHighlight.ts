import {AreaHighlightRenderers} from "../../../apps/doc/src/annotations/AreaHighlightRenderers";
import {IDocScale} from "../../../apps/doc/src/DocViewerStore";
import {Backend} from "polar-shared/src/datastore/Backend";
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {ArrayBuffers} from "polar-shared/src/util/ArrayBuffers";
import {DataURLs} from "polar-shared/src/util/DataURLs";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {FileType} from "../apps/main/file_loaders/FileType";
import {CloudStorage} from "../datastore/FirebaseCloudStorage";
import {Images} from "../metadata/Images";
import {ICapturedScreenshot} from "../screenshots/Screenshot";
import {AreaHighlightAnnotationContent} from "./content/AnnotationContent";

export namespace BlockAreaHighlight {
    
    export async function persistScreenshot(cloudStorage: CloudStorage, screenshot: ICapturedScreenshot) {
        const id = Images.createID();
        const ext = Images.toExt(screenshot.type);


        const toBlob = () => {

            if (typeof screenshot.data === 'string') {
                return DataURLs.toBlob(screenshot.data);
            } else {
                return ArrayBuffers.toBlob(screenshot.data);
            }

        };

        const name = `${id}.${ext}`;

        const writeResult = await cloudStorage.writeFile(
            Backend.IMAGE,
            { name },
            toBlob(),
            { visibility: Visibility.PUBLIC },
        );

        return {
            ...writeResult,
            id,
            ext,
        };
    }

    export type CreateOpts = {
        fingerprint: string,
        pageNum: number,
        docScale: IDocScale,
        fileType: FileType,
        rect: ILTRect,
        docViewerElement: HTMLElement,
    };

    export async function create(opts: CreateOpts) {
        const {
            fingerprint,
            pageNum,
            docScale,
            fileType,
            rect,
            docViewerElement,
        } = opts;

        const {
            capturedScreenshot: screenshot,
            areaHighlight,
        } = await AreaHighlightRenderers.createAreaHighlightFromEvent(
            pageNum,
            rect,
            docScale,
            fileType,
            docViewerElement
        );

        return {
            screenshot,
            content: new AreaHighlightAnnotationContent({
                pageNum,
                type: AnnotationContentType.AREA_HIGHLIGHT,
                docID: fingerprint,
                value: areaHighlight,
            }),
        };
    }
}
