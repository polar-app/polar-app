import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {AnnotationRects} from "../../../../web/js/metadata/AnnotationRects";
import {Rects} from "../../../../web/js/Rects";
import {computePageDimensions} from "./PagemarkRenderer2";
import {AreaHighlights} from "../../../../web/js/metadata/AreaHighlights";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IPoint} from "../../../../web/js/Point";
import {IDocScale} from "../DocViewerStore";

export namespace AreaHighlightRenderers {

    export function createAreaHighlightFromEvent(clientPoint: IPoint, docScale: IDocScale) {

        const rectFromEvent = AnnotationRects.createFromClientPoint(clientPoint);
        const annotationRect = AreaHighlights.toCorrectScale2(Rects.createFromBasicRect(rectFromEvent),
                                                              docScale.scaleValue);

        return AreaHighlights.create({rect: annotationRect});

        //
        // const docMeta = this.model.docMeta;
        // const pageMeta =  DocMetas.getPageMeta(docMeta, contextMenuLocation.pageNum);
        //
        // pageMeta.areaHighlights[areaHighlight.id] = areaHighlight;

    }

}


function createAreaHighlight(rect: ILTRect,
                             pageNum: number) {

    const pageDimensions = computePageDimensions(pageNum)

    const annotationRect = AnnotationRects.createFromPositionedRect(Rects.createFromBasicRect(rect),
                                                                    pageDimensions);

    return AreaHighlights.create({rect: annotationRect});


}

export interface IWriteAreaHighlightOpts {
    readonly docMeta: IDocMeta;
    readonly pageMeta: IPageMeta;
    readonly rect: ILTRect;
    readonly areaHighlight: IAreaHighlight;
}

export async function writeAreaHighlight(opts: IWriteAreaHighlightOpts) {
    //
    // const {docMeta, pageMeta, areaHighlight, rect} = opts;
    //
    // const extractedImage = await Screenshots.capture(pageMeta.pageInfo.num, rect);
    //
    // const writeOpts: AreaHighlightWriteOpts = {
    //     datastore: this.persistenceLayerProvider(),
    //     docMeta,
    //     pageMeta,
    //     areaHighlight,
    //     rect,
    //     position,
    //     extractedImage
    // };
    //
    // const writer = AreaHighlights.write(writeOpts);
    //
    // const [writtenAreaHighlight, committer] = writer.prepare();
    //
    // this.areaHighlight = writtenAreaHighlight;
    //
    // await committer.commit();

}
