export namespace WikiLinksToHTML {

    export function escape(markdown: string) {
        return markdown.replace(/\[\[([^\]\[]+)\]\]/g, (_, args) => {
            const className = args.startsWith('#') ? "note-tag" : "note-link";
            return `<a contenteditable="false" class="${className}" href="#${args.replace(/^#/, '')}">${args}</a>`;
        });
    }

    export function unescape(html: string) {
        return html.replace(/<a contenteditable="false" class="[\w-]+" href="([^"]+)">([^<]+)<\/a>/g, (_, _1, match1) => `[[${match1}]]`);
    }

}
