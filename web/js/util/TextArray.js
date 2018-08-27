"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TextArray {
    constructor(width, height) {
        this.backing = [];
        this.width = width;
        this.height = height;
        this.backing = [];
        for (let idx = 0; idx < height; ++idx) {
            this.backing[idx] = this.createArray(width);
        }
    }
    createArray(length, defaultValue = " ") {
        let result = new Array(length);
        result.fill(defaultValue);
        return result;
    }
    write(x, y, val) {
        if (!val) {
            throw new Error("No val");
        }
        if (val.length !== 1) {
            throw new Error("Strings can only be 1 char");
        }
        let row = this.backing[y];
        if (!row) {
            throw new Error(`No row for y index: ${y} (width=${this.width}, height=${this.height})`);
        }
        row[x] = val;
    }
    charAt(x, y) {
        return this.backing[y][x];
    }
    merge(source) {
        for (let x = 0; x < source.width; ++x) {
            for (let y = 0; y < source.height; ++y) {
                let ch = source.charAt(x, y);
                if (ch === " ")
                    continue;
                this.write(x, y, ch);
            }
        }
    }
    toString() {
        let result = "";
        this.backing.forEach(current => {
            result += current.join("");
            result += "\n";
        });
        return result;
    }
}
exports.TextArray = TextArray;
//# sourceMappingURL=TextArray.js.map