export namespace WikiLinksToHTML {

    export function escape(markdown: string) {
        return markdown.replace(/\[\[((?:(?:\\\]|\\\[)|[^\]\[])+)\]\]/g, (_, args) => {
            const className = args.startsWith('#') ? "note-tag" : "note-link";
            const target = args.replace(/^#/, '').replace(/\\([\[\]\(\)])/g, '$1');
            return `<a contenteditable="false" class="${className}" href="#${target}">${args}</a>`;
        });
    }

    export function unescape(html: string) {
        return html.replace(/<a contenteditable="false" class="[\w-]+" href="([^"]+)">([^<]+)<\/a>/g, (_, args) => `[[${args.slice(1).replace(/([\[\]\(\)])/g, '\\$1')}]]`);
    }

}
