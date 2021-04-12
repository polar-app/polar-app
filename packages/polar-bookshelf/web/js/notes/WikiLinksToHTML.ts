export namespace WikiLinksToHTML {

    export function escape(markdown: string) {
        return markdown.replace(/\[\[([^\]]+)\]\]/g, (substring, args) => `<a href="#${args}">${args}</a>`);
    }

    export function unescape(markdown: string) {
        return markdown.replace(/<a href="([^"]+)">([^<]+)<\/a>/g, (substring, match0, match1) => `[[${match1}]]`);
    }

}