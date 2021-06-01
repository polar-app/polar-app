import {MarkdownToHTMLUsingMarked} from "./MarkdownToHTMLUsingMarked";

const DELEGATE = 'marked';

function requireDelegate() {
    return require('./MarkdownToHTMLUsingMarked') as (typeof MarkdownToHTMLUsingMarked);
}

export namespace MarkdownToHTML {

    const delegate = requireDelegate();

    export function markdown2html(markdown: string) {
        return delegate.markdown2html(markdown);
    }

}
