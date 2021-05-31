export namespace WikiLinksToHTML {

    export function escape(markdown: string) {
        return markdown.replace(/\[\[([^\]\[]+)\]\]/g, (_, args) => `<a contenteditable="false" href="#${args}">${args}</a>`);
    }

    export function unescape(html: string) {
        return html.replace(/<a contenteditable="false" href="([^"]+)">([^<]+)<\/a>/g, (_, _1, match1) => `[[${match1}]]`);
    }

}
