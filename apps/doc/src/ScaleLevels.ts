import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Arrays} from "polar-shared/src/util/Arrays";

export namespace PDFScales {

    /**
     * The document scale value as a double. For example 100% = 1.0.  140% = 1.4, etc.
     */
    export type ScaleValue = number;

    export type ScaleDelta = '+' | '-';

    export function computeNextZoomLevel(delta: ScaleDelta,
                                         currentScaleValue: ScaleValue | undefined): ScaleLevelTuple | undefined {

        if (currentScaleValue === undefined) {
            return undefined;
        }

        const discreteScaleLevelTuples = ScaleLevelTuples.filter(current => ! isNaN(parseFloat(current.value)));
        const discreteZoomLevels = discreteScaleLevelTuples.map(current => parseFloat(current.value));

        type ZoomPredicate = (scaleValue: number) => boolean;

        const predicate: ZoomPredicate =
            delta === '+' ? (scaleValue) => scaleValue > currentScaleValue :
                            (scaleValue) => scaleValue < currentScaleValue

        const filteredDiscreteZoomLevels
            = arrayStream(discreteZoomLevels)
                .filter(predicate)
                .collect();

        const sortedZoomLevels
            = arrayStream(filteredDiscreteZoomLevels)
                .sort((a, b) => a - b)
                .collect();

        const newZoomLevel = delta === '+' ? Arrays.first(sortedZoomLevels)! : Arrays.last(sortedZoomLevels)!;

        if (newZoomLevel) {

            return arrayStream(ScaleLevelTuples)
                    .filter(current => current.value === `${newZoomLevel}`)
                    .first()!;

        } else {

            switch (delta) {

                case "+":
                    return Arrays.last(discreteScaleLevelTuples)!;
                case "-":
                    return Arrays.first(discreteScaleLevelTuples)!;

            }

        }

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

// TODO: we need more intervals than ust these - the gaps are too large.
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
