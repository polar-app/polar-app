export namespace WikiLinks {

    export function escape(markdown: string) {
        return markdown.replace(/\[\[([^\]]+)\]\]/g, (substring, args) => `[${args}](#${args})`);
    }

    export function unescape(markdown: string) {
        return markdown.replace(/\[([^\]]+)\]\[#([^\]]+)\]/g, (substring, args) => `[[${args}]]`);
    }

}