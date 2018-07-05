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

}

module.exports.Text = Text;
