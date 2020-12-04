export namespace WikiLinksToMarkdown {

    export function escape(markdown: string) {
        return markdown.replace(/\[\[([^\]]+)\]\]/g, (substring, args) => `[${args}](#${args})`);
    }

    /**
     * Convert markdown links like:
     *
     * [hello](#hello) to [[hello]]
     *
     * @param markdown
     */
    export function unescape(markdown: string) {
        return markdown.replace(/\[([^\]]+)\]\(#([^\]]+)\)/g, (substring, args) => `[[${args}]]`);
    }

}