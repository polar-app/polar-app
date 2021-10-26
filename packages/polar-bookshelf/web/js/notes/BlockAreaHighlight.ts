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
import {MAIN_HIGHLIGHT_COLORS} from "../ui/ColorMenu";

export namespace BlockAreaHighlight {

    export function screenshotDataToBlob(data: string | ArrayBuffer) {
        if (typeof data === 'string') {
            return DataURLs.toBlob(data);
        } else {
            return ArrayBuffers.toBlob(data);
        }
    }
    
    export async function persistScreenshot(cloudStorage: CloudStorage, screenshot: ICapturedScreenshot) {
        const id = Images.createID();
        const ext = Images.toExt(screenshot.type);

        const name = `${id}.${ext}`;

        const writeResult = await cloudStorage.writeFile(
            Backend.IMAGE,
            { name },
            BlockAreaHighlight.screenshotDataToBlob(screenshot.data),
            { visibility: Visibility.PUBLIC },
        );

        return {
            ...writeResult,
            id,
            ext,
        };
    }

    export type CreateOpts = {
        readonly fingerprint: string,
        readonly pageNum: number,
        readonly docScale: IDocScale,
        readonly fileType: FileType,
        readonly rect: ILTRect,
        readonly docViewerElement: HTMLElement,
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
            areaHighlight: { rects, color, order },
            position,
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
                links: [],
                value: {
                    color: color || MAIN_HIGHLIGHT_COLORS[0],
                    rects,
                    position,
                    order,
                },
            }),
        };
    }
}
