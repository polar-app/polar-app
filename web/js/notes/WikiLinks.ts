export namespace WikiLinks {

    export function escape(markdown: string) {
        return markdown.replace(/\[\[([^\]]+)\]\]/, (substring, args) => `[${args}][#${args}]`);
    }

    export function unescape(markdown: string) {
        return markdown.replace(/\[([^\]]+)\]\[#([^\]]+)\]/, (substring, args) => `[[${args}]]`);
    }

}