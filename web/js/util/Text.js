class Text {

    /**
     * Indent the lines in the given text with the given prefix.
     *
     * @param text {string}
     * @param prefix {string}
     * @return {string}
     *
     */
    static indent(text, prefix) {

        let result = prefix + text;
        return result.replace(/\n/g, `\n${prefix}`);

    }

    static isWhitespace(text) {
        return /^\s+$/.test(text);
    }

    /**
     *
     * @param ch {string} The char to duplicate.
     * @param len {number} the amount of text.
     */
    static createDuplicateText(ch,len) {

        if(ch.length !== 1) {
            throw new Error("The ch char must be 1 char");
        }

        let arr = new Array(len);

        arr.fill(ch);

        return arr.join("");

    }

}

module.exports.Text = Text;
