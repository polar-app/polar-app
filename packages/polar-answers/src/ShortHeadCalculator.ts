import { arrayStream } from "polar-shared/src/util/ArrayStreams";
import {Tuples} from "polar-shared/src/util/Tuples";

// https://www.mathsisfun.com/algebra/trig-finding-angle-right-triangle.html
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asin
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin
export namespace ShortHeadCalculator {

    // FIXME: these are the changes we should make here:
    //
    // - normalize everything around the minimum point in the set being 1.0...  It doesn't have to be based on 1.0
    //   but it makes things easier to reason over since there's a standard anchor/min.

    // - once the vector is normalized, compute the max

    // - redistribute the x-axis over the range of the max so that it's now a square cartesian plane.


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

        // technically we can just read the last vector but this is a bit less
        // error prone but still not necessary.  We might even want to analyze the
        // vector ahead of time to make sure it's sorted by this is O(N) but that's
        // still computationally cheap so we will probably end up doing it anyway.

        const min = Math.min(...vector);

        const norm = 1.0 / min;

        function toNormalizedValue(original: number) {
            return {
                value: original * norm,
                original,
            }
        }

        return vector.map(toNormalizedValue);

    }

    export function calcAngleBetweenPoints(p0: INormalizedPoint, p1: INormalizedPoint) {

        // TODO: I do not thinking I'm properly spacing things out because the
        // points are too high I think and the vector isn't really normalized.
        // It might have to be some function of the sum of the space.
        console.log("FIXME: p0, and p1", p0, p1);

        // FIXME: compute this into a right triangle

        // FIXME: the angles are off so ...

        // FIXME: compute hyp and opp

        const height = Math.abs(p0.y.value - p1.y.value);
        const width = Math.abs(p0.x.value - p1.x.value);

        // need the pythagorean theory to compute hyp...
        const hyp = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));

        return calcAngle(height, hyp)

    }

    /**
     * Compute the angle between points. Note that we have N-1 angles in a given vector.
     */
    export function computeAngles(normalizedPoints: NormalizedPoints) {

        return arrayStream(Tuples.createSiblings(normalizedPoints))
            .map(current => {

                if (current.prev === undefined || current.next === undefined) {
                    // we are at the beginning or end.
                    return undefined;
                }

                const p0 = {
                    x: current.curr.x,
                    y: current.curr.y
                };

                const p1 = {
                    x: current.next.x,
                    y: current.next.y
                };

                return calcAngleBetweenPoints(p0, p1);

            })
            .filterPresent()
            .collect();

    }

    export function calcAngle(opp: number, hyp: number) {
        console.log("FIXME: ", {opp, hyp});
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
