
export class Text {

    /**
     * Indent the lines in the given text with the given prefix.
     *
     * @param text {string}
     * @param prefix {string}
     * @return {string}
     *
     */
    public static indent(text: string, prefix: string) {

        const result = prefix + text;
        return result.replace(/\n/g, `\n${prefix}`);

    }

    public static isWhitespace(text: string) {
        return /^\s+$/.test(text);
    }

    /**
     *
     * @param ch {string} The char to duplicate.
     * @param len {number} the amount of text.
     */
    public static createDuplicateText(ch: string, len: number) {

        if (ch.length !== 1) {
            throw new Error("The ch char must be 1 char");
        }

        const arr = new Array(len);

        arr.fill(ch);

        return arr.join("");

    }

}


