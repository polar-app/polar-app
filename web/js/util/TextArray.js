/**
 * A 2D array of text so we can update positions directly.
 */
class TextArray {

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.backing = [];

        for(let idx = 0; idx <= height; ++idx) {
            this.backing[idx] = this.createArray(width);
        }

    }

    /**
     * Create a given array of the length with the given default
     * @param length
     * @param defaultValue
     */
    createArray(length, defaultValue) {
        let result = new Array(length);
        result.fill(" ");
        return result;
    }

    /**
     * Write to the given x, y coord
     *
     * @param x {number}
     * @param y {number}
     * @param val {string}
     */
    write(x, y, val) {
        if(val.length !== 1) {
            throw new Error("Strings can only be 1 char");
        }

        let row = this.backing[y];

        if(! row) {
            throw new Error(`No row for y index: ${y} (width=${this.width}, height=${this.height})`);
        }

        row[x] = val;

    }

    /**
     *
     * @return {string}
     */
    toString() {

        let result = "";

        this.backing.forEach(current => {
            result += current.join("");
            result += "\n";
        });

        return result;

    }

}

module.exports.TextArray = TextArray;
