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
import {Screenshots} from "../../../../web/js/screenshots/Screenshots";
import {ICapturedScreenshot} from "../../../../web/js/screenshots/Screenshot";
import {Position} from "polar-shared/src/metadata/IBaseHighlight";

export namespace AreaHighlightRenderers {

    export interface ICapturedAreaHighlight {
        readonly capturedScreenshot: ICapturedScreenshot;
        readonly areaHighlight: IAreaHighlight;
        readonly position: Position;
    }

    export async function createAreaHighlightFromEvent(pageNum: number,
                                                       clientPoint: IPoint,
                                                       docScale: IDocScale): Promise<ICapturedAreaHighlight> {

        const rect = AnnotationRects.createFromClientPoint(clientPoint);
        const annotationRect = AreaHighlights.toCorrectScale2(Rects.createFromBasicRect(rect),
                                                              docScale.scaleValue);

        const position: Position = {
            x: annotationRect.left,
            y: annotationRect.top,
            width: annotationRect.width,
            height: annotationRect.height,
        };

        const capturedScreenshot = await Screenshots.capture(pageNum, rect);

        const areaHighlight = AreaHighlights.create({rect: annotationRect});

        return {capturedScreenshot, areaHighlight, position};

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
