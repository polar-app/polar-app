import {MarkdownToHTMLUsingMarked} from "./MarkdownToHTMLUsingMarked";
import {MarkdownToHTMLUsingMarkdownIT} from "./MarkdownToHTMLUsingMarkdownIT";

const DELEGATE: 'Marked' | 'MarkdownIT' = 'MarkdownIT';

function requireDelegate() {

    switch(DELEGATE) {

        case "Marked":
            return require('./MarkdownToHTMLUsingMarked') as (typeof MarkdownToHTMLUsingMarked);
        case "MarkdownIT":
            return require('./MarkdownToHTMLUsingMarkdownIT') as (typeof MarkdownToHTMLUsingMarkdownIT);
    }

}

export namespace MarkdownToHTML {

    const delegate = requireDelegate();

    export function markdown2html(markdown: string) {
        return delegate.markdown2html(markdown);
    }

}
