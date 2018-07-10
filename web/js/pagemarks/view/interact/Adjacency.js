
/**
 * Represents the results from the {RectAdjacencyCalculator}
 */
class Adjacency {

    constructor() {

        /**
         *
         * @type {Rect}
         */
        this.primaryRect = undefined;

        /**
         *
         * @type {Rect}
         */
        this.secondaryRect = undefined;

        this.adjustments = {

            /**
             * @type {LineAdjustment}
             */
            horizontal: null,

            /**
             * @type {LineAdjustment}
             */
            vertical: null

        };

        /**
         *
         * The final adjustment.
         *
         * @type {LineAdjustment}
         */
        this.adjustment = null;

        /**
         * @type {Rect}
         */
        this.adjustedRect = null;

    }

}

module.exports.Adjacency = Adjacency;
