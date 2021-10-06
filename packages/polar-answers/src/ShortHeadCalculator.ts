
// https://www.mathsisfun.com/algebra/trig-finding-angle-right-triangle.html
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asin
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin

import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace ShortHeadCalculator {

    /**
     * A point type.  This could be a tuple too but it's less well documented
     * this way.
     */
    export type Point = {x: number, y: number};

    /**
     * Regular vector of numbers.
     */
    export type Vector = ReadonlyArray<number>;

    /**
     * A normalized value that is scaled and we also preserve the original value.
     */
    export interface INormalizedValue {

        /**
         * The scaled value which we should be using.  We provide the original
         * to reconstruct after the fact.
         */
        readonly value: number;

        /**
         * The original value;
         */
        readonly original: number;

    }

    /**
     * A vector where the values are normalized based on the vector length so it
     * computes into a square cartesian plane.
     */
    export type NormalizedVector = ReadonlyArray<INormalizedValue>;

    export type NormalizedPoints = ReadonlyArray<INormalizedPoint>;

    export interface INormalizedPoint {
        readonly x: INormalizedValue;
        readonly y: INormalizedValue;
    }

    export function normalizeXY(vector: Vector): NormalizedPoints {
        return normalizeX(normalizeY(vector));
    }

    export function normalizeX(vector: NormalizedVector): NormalizedPoints {

        if (vector.length === 0) {
            return [];
        }

        const max = Math.max(...vector.map(current => current.value));

        // eslint-disable-next-line camelcase
        const x_gap = max / vector.length;

        function toNormalizedPoint(value: INormalizedValue, idx: number): INormalizedPoint {
            const x = {
                // eslint-disable-next-line camelcase
                value: idx * x_gap,
                original: idx
            }

            const y = value;

            return {x, y}
        }

        return vector.map(toNormalizedPoint);

    }

    /**
     * Normalize the Y axis with a 1.0 minimum.
     */
    export function normalizeY(vector: Vector): NormalizedVector {

        if (vector.length === 0) {
            // we're done since there are no values and there's nothing to
            // normalize.
            return [];
        }

        function shiftToPositive(vector: Vector): NormalizedVector {

            const min = Math.min(...vector);

            function toNormalizedValue(original: number, adj: number): INormalizedValue {
                return {
                    value: original + adj,
                    original,
                }
            }

            if (min < 1.0) {
                const adj = 1.0 - Math.abs(min);
                return vector.map(current => toNormalizedValue(current, adj));
            }

            return vector.map(current => toNormalizedValue(current, 0));

        }

        // technically we can just read the last vector but this is a bit less
        // error prone but still not necessary.  We might even want to analyze the
        // vector ahead of time to make sure it's sorted by this is O(N) but that's
        // still computationally cheap so we will probably end up doing it anyway.

        function scaleToBase(vector: NormalizedVector) {

            const min = Math.min(...vector.map(current => current.value));

            const norm = 1.0 / min;

            function toNormalizedValue(normalizedValue: INormalizedValue) {
                return {
                    value: normalizedValue.value * norm,
                    original: normalizedValue.original,
                }
            }

            return vector.map(toNormalizedValue);

        }

        return scaleToBase(shiftToPositive(vector));

        // return scaleToBase(vector.map(current => {
        //     return {
        //         value: current,
        //         original: current
        //     }
        // }));

        // return shiftToPositive(vector);

    }

    export interface IAngleBetweenPoints {
        readonly width: number;
        readonly height: number;
        readonly hyp: number;
        readonly angle: number;

        readonly p0: INormalizedPoint;
        readonly p1: INormalizedPoint;
    }

    export function calcAngleBetweenPoints(p0: INormalizedPoint, p1: INormalizedPoint): IAngleBetweenPoints {

        const height = Math.abs(p0.y.value - p1.y.value);
        const width = Math.abs(p0.x.value - p1.x.value);

        // need the pythagorean theory to compute hyp...
        const hyp = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));

        const angle = calcAngle(height, hyp)

        return {height, width, hyp, angle, p0, p1};

    }

    export interface IComputeOpts {

        /**
         * The target angle to truncate results.
         */
        // eslint-disable-next-line camelcase
        readonly target_angle: number;

        /**
         * The minimum docs needed to run the short head computation.  We need some
         * setting here as a short head computation on a short vector isn't going to be
         * very reliable and further the costs of just executing across all the
         * documents is fairly reasonable.
         */
        // eslint-disable-next-line camelcase
        readonly min_docs: number;

        /**
         * The max number of docs to return no matter what the short head is computed as.
         */
        // eslint-disable-next-line camelcase
        readonly max_docs: number;

    }

    export const DEFAULT_COMPUTE_OPTS: IComputeOpts = {
        target_angle: 20,
        min_docs: 25,
        max_docs: Number.POSITIVE_INFINITY
    };

    // eslint-disable-next-line camelcase
    export function compute(vector: Vector, opts: IComputeOpts = DEFAULT_COMPUTE_OPTS): Vector | undefined {

        const normalized = ShortHeadCalculator.normalizeXY(vector);
        return ShortHeadCalculator.computeShortHead(normalized, opts.target_angle, opts.max_docs);

    }

    // eslint-disable-next-line camelcase
    export function computeShortHead(normalizedPoints: NormalizedPoints, target_angle = 20, max_docs: number) {

        /**
         * Factor to determine what % of total nodes is used as a buffer to
         * determine the angle.
         */
        const fact = 0.1;

        const buff = Math.floor(Math.max(normalizedPoints.length * fact, 5));

        if (normalizedPoints.length <= buff) {
            return undefined;
        }

        function computeTermination(): number | undefined {

            for(let i = 0; normalizedPoints.length - buff; ++i) {
                const p0 = normalizedPoints[i];
                const p1 = normalizedPoints[i + buff];

                if (! p1) {
                    console.warn(`No point p1 at ${i} for buff ${buff}`);
                    break;
                }

                const angle = calcAngleBetweenPoints(p0, p1).angle

                // eslint-disable-next-line camelcase
                if (angle < target_angle) {
                    return i;
                }

            }

            return undefined;

        }

        const term = computeTermination();

        if (term === undefined) {
            return undefined;
        }

        return arrayStream(normalizedPoints.slice(0, term).map(current => current.y.original))
            .head(max_docs)
            .collect()

    }

    export function calcAngle(opp: number, hyp: number) {
        return radiansToDegrees(Math.asin(opp / hyp));
    }

    export type Radians = number;

    export type Degrees = number;

    export function degreesToRadians(degrees: Degrees): Radians {
        return degrees * (Math.PI/180);
    }

    export function radiansToDegrees(radians: Radians): Degrees {
        return radians / (Math.PI/180);
    }

}
