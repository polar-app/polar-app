import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {AnnotationRects} from "../../../../web/js/metadata/AnnotationRects";
import {Rects} from "../../../../web/js/Rects";
import {computePageDimensions} from "./PagemarkRenderer2";
import {AreaHighlights} from "../../../../web/js/metadata/AreaHighlights";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

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
