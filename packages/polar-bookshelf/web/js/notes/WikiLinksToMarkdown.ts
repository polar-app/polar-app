export namespace WikiLinksToMarkdown {
    export const WIKI_LINK_REGEX = /\[\[((?:(?:\\\[|\\\])|[^\]\[])+)\]\]/g;

    /**
     * @deprecated
     */
    export function escape(markdown: string) {
        return markdown.replace(WIKI_LINK_REGEX, (_, args) => `[${args}](#${args})`);
    }

    /**
     * @deprecated
     * Convert markdown links like:
     *
     * [hello](#hello) to [[hello]]
     *
     * @param markdown
     */
    export function unescape(markdown: string) {
        return markdown.replace(/\[((?:(?:\\\[|\\\])|[^\]\[])+)\]\(#((?:(:?\\\(|\\\))|[^\)\(])+)\)/g, (_, args) => `[[${args}]]`);
    }
}
