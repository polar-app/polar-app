/**
 * A 2D array of text so we can update positions directly.
 */
export class TextArray {

    public readonly width: number;
    public readonly height: number;

    private readonly backing: string[][] = [];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.backing = [];

        for(let idx = 0; idx < height; ++idx) {
            this.backing[idx] = this.createArray(width);
        }

    }

    /**
     * Create a given array of the length with the given default
     */
    createArray(length: number, defaultValue: string = " "): string[] {
        let result = new Array(length);
        result.fill(defaultValue);
        return result;
    }

    /**
     * Write to the given x, y coord
     *
     * @param x {number}
     * @param y {number}
     * @param val {string}
     */
    write(x: number, y: number, val: string) {

        if(!val) {
            throw new Error("No val");
        }

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
     */
    charAt(x: number, y: number) {
        return this.backing[y][x];
    }

    /**
     * Write every non-default (non space) char in the source into the target.
     *
     */
    merge(source: TextArray) {

        for(let x = 0; x < source.width; ++x) {

            for(let y = 0; y < source.height; ++y) {

                let ch = source.charAt(x,y);

                if(ch === " ") {
                    continue;
                }

                this.write(x, y, ch);

            }

        }

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
