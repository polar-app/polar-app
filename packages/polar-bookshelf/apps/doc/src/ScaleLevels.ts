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

export type CustomZoomLevel = string; // Custom zoom levels

export type ScaleLevel =
    'page-fit'
    | 'page-width'
    | '0.5'
    | '0.6'
    | '0.7'
    | '0.75'
    | '0.8'
    | '0.9'
    | '1'
    | '1.1'
    | '1.2'
    | '1.3'
    | '1.4'
    | '1.5'
    | '1.6'
    | '1.7'
    | '1.8'
    | '1.9'
    | '2'
    | '2.1'
    | '2.2'
    | '2.3'
    | '2.4'
    | '2.5'
    | '2.6'
    | '2.7'
    | '2.8'
    | '2.9'
    | '3'
    | '3.1'
    | '3.2'
    | '3.3'
    | '3.4'
    | '3.5'
    | '3.6'
    | '3.7'
    | '3.8'
    | '3.9'
    | '4'
    | '4.5'
    | '5'
    | '5.5'
    | '6'
    | CustomZoomLevel
    ;

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
// export const ScaleLevelTuples: ReadonlyArray<ScaleLevelTuple> = [
//     SCALE_VALUE_PAGE_FIT,
//     SCALE_VALUE_PAGE_WIDTH,
//     {
//         label: '50%',
//         value: '0.5'
//     },
//     {
//         label: '75%',
//         value: '0.75'
//     },
//     {
//         label: '100%',
//         value: '1'
//     },
//     {
//         label: '200%',
//         value: '2'
//     },
//     {
//         label: '300%',
//         value: '3'
//     }
//     ,
//     {
//         label: '400%',
//         value: '4'
//     }
//
// ];

export const ScaleLevelTuples: ReadonlyArray<ScaleLevelTuple> = [
    SCALE_VALUE_PAGE_FIT,
    SCALE_VALUE_PAGE_WIDTH,
    {
        label: '50%',
        value: '0.5'
    },
    {
        label: '60%',
        value: '0.6'
    },
    {
        label: '70%',
        value: '0.7'
    },
    {
        label: '80%',
        value: '0.8'
    },
    {
        label: '90%',
        value: '0.9'
    },
    {
        label: '100%',
        value: '1'
    },
    {
        label: '110%',
        value: '1.1'
    },
    {
        label: '130%',
        value: '1.3'
    },
    {
        label: '150%',
        value: '1.5'
    },
    {
        label: '170%',
        value: '1.7'
    },
    {
        label: '190%',
        value: '1.9'
    },
    {
        label: '200%',
        value: '2'
    },
    {
        label: '210%',
        value: '2.1'
    },
    {
        label: '240%',
        value: '2.4'
    },
    {
        label: '270%',
        value: '2.7'
    },
    {
        label: '300%',
        value: '3'
    },
    {
        label: '330%',
        value: '3.3'
    },
    {
        label: '370%',
        value: '3.7'
    },
    {
        label: '400%',
        value: '4'
    },
    {
        label: '450%',
        value: '4.5'
    },
    {
        label: '500%',
        value: '5'
    },
    {
        label: '550%',
        value: '5.5'
    },
    {
        label: '600%',
        value: '6'
    }


];

export const ScaleLevelTuplesMap = arrayStream(ScaleLevelTuples).toMap(current => current.label);
