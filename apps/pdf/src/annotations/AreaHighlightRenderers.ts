import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {AnnotationRects} from "../../../../web/js/metadata/AnnotationRects";
import {Rects} from "../../../../web/js/Rects";
import {AreaHighlights} from "../../../../web/js/metadata/AreaHighlights";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IPoint} from "../../../../web/js/Point";
import {IDocScale} from "../DocViewerStore";
import {Screenshots} from "../../../../web/js/screenshots/Screenshots";
import {ICapturedScreenshot} from "../../../../web/js/screenshots/Screenshot";
import {Position} from "polar-shared/src/metadata/IBaseHighlight";
import {computePageDimensions} from "./AnnotationHooks";

export namespace AreaHighlightRenderers {

    import getPageElementDimensions = AnnotationRects.getPageElementDimensions;

    export interface ICapturedAreaHighlight {
        readonly capturedScreenshot: ICapturedScreenshot;
        readonly areaHighlight: IAreaHighlight;
        readonly position: Position;
    }

    export async function createAreaHighlightFromEvent(pageNum: number,
                                                       pointWithinPageElement: IPoint,
                                                       docScale: IDocScale): Promise<ICapturedAreaHighlight> {

        const rect = AnnotationRects.createFromPointWithinPageElement(pageNum, pointWithinPageElement);

        const pageDimensions = getPageElementDimensions(pageNum);

        if (! pageDimensions) {
            throw new Error("No page dimensions");
        }

        const overlayRect = rect.toDimensions(pageDimensions);

        const positionRect = AreaHighlights.toCorrectScale2(overlayRect,
                                                            docScale.scaleValue);

        const position: Position = {
            x: positionRect.left,
            y: positionRect.top,
            width: positionRect.width,
            height: positionRect.height,
        };

        const capturedScreenshot = await Screenshots.capture(pageNum, overlayRect);

        const areaHighlight = AreaHighlights.create({rect});

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
