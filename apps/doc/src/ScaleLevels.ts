import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace PDFScales {

    export function computeNextZoomLevel(delta: number,
                                         currentScale: ScaleLevelTuple | undefined): ScaleLevelTuple | undefined {

        if (! currentScale) {
            return undefined;
        }

        const pdfScaleLevels =
            arrayStream(ScaleLevelTuples)
                .map(current => current.value)
                .collect();

        const currentScaleLevelIdx = pdfScaleLevels.indexOf(currentScale.value);

        const nextIdx = currentScaleLevelIdx + delta;

        return ScaleLevelTuples[nextIdx] || undefined;

    }
}

export interface LabelValueTuple<V> {
    readonly label: string;
    readonly value: V;
}

export type ScaleLevel =
    'page-fit'
    | 'page-width'
    | '0.5'
    | '0.75'
    | '1'
    | '2'
    | '3'
    | '4';
export type ScaleLevelTuple = LabelValueTuple<ScaleLevel>;

export const SCALE_VALUE_PAGE_FIT: ScaleLevelTuple = {
    label: 'page fit',
    value: 'page-fit'
}

export const SCALE_VALUE_PAGE_WIDTH: ScaleLevelTuple = {
    label: 'page width',
    value: 'page-width'
}

export const ScaleLevelTuples: ReadonlyArray<ScaleLevelTuple> = [
    SCALE_VALUE_PAGE_FIT,
    SCALE_VALUE_PAGE_WIDTH,
    {
        label: '50%',
        value: '0.5'
    },
    {
        label: '75%',
        value: '0.75'
    },
    {
        label: '100%',
        value: '1'
    },
    {
        label: '200%',
        value: '2'
    },
    {
        label: '300%',
        value: '3'
    }
    ,
    {
        label: '400%',
        value: '4'
    }

];

export const ScaleLevelTuplesMap = arrayStream(ScaleLevelTuples).toMap(current => current.label);
