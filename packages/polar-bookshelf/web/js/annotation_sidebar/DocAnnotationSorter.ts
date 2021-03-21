import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IPageInfo} from "polar-shared/src/metadata/IPageInfo";
import {IDimensions} from "../util/IDimensions";

export namespace DocAnnotationSorter {

    export interface IPosition {
        readonly x: number;
        readonly y: number;
    }

    export interface ISortable {
        readonly id: string;
        readonly pageNum: number;
        readonly order: number | undefined;
        readonly position: IPosition;
    }

    type SortFunction<D> = (data: ReadonlyArray<D>) => ReadonlyArray<D>

    export type PageInfoIndex = {[pageNum: number]: IPageInfo};

    export function create<D extends ISortable>(pageMetaIndex: PageInfoIndex,
                                                columnLayout: number): SortFunction<D> {

        return (data) => {

            // TODO: I would prefer that this was a binary tree which was maintained sorted

            const computeScore = (item: D) => {

                function computePageComponent() {
                    return item.pageNum;
                }

                function computeColumnLayoutComponent(): number {

                    function scaleDimensionsToWeb(dimensions: IDimensions) {
                        const WEB_RESOLUTION = 96;
                        const PDF_RESOLUTION = 72;

                        const UPSCALE_RATIO = WEB_RESOLUTION / PDF_RESOLUTION;

                        return {
                            width: dimensions.width * UPSCALE_RATIO,
                            height: dimensions.height * UPSCALE_RATIO,
                        };

                    }

                    const dimensions = pageMetaIndex[item.pageNum]?.dimensions;

                    if (! dimensions) {
                        return 0;
                    }

                    if (item.order !== undefined) {
                        return 0;
                    }

                    const webDimensions = scaleDimensionsToWeb(dimensions);
                    const {width} = webDimensions;
                    const columnWidth = width / columnLayout;

                    return Math.floor(item.position.x / columnWidth);

                }

                function computeSuffixComponent() {

                    if (item.order !== undefined) {
                        return item.order * 100;
                    } else {
                        return (item.position.y * 100) + item.position.x;
                    }

                }

                const pageComponent = computePageComponent() * 100000000;
                const columnLayoutComponent = computeColumnLayoutComponent() * 100000;
                const suffix = computeSuffixComponent();

                return pageComponent + columnLayoutComponent + suffix;

            };

            const compareFn = (a: D, b: D) => {

                const diff = computeScore(a) - computeScore(b);

                if (diff === 0) {
                    return a.id.localeCompare(b.id);
                }

                return diff;

            };

            return arrayStream(data).sort(compareFn).collect();

        }

    }

}
