class Point {

    constructor(obj) {

        /**
         * @type number
         */
        this.x = undefined;

        /**
         * @type number
         */
        this.y = undefined;

        Object.assign(this, obj);

    }

}

module.exports.Point = Point;
