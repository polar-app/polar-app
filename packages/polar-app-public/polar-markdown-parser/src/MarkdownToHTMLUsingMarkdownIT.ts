import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
    linkify: false
});

export namespace MarkdownToHTMLUsingMarkdownIT {

    export function markdown2html(markdown: string) {
        return md.render(markdown);
    }

}
