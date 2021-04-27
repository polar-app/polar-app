import {MarkdownToHTML} from "polar-markdown-parser/src/MarkdownToHTML";
import {HTMLToMarkdown} from "polar-markdown-parser/src/HTMLToMarkdown";
import markdown2html = MarkdownToHTML.markdown2html;
import html2markdown = HTMLToMarkdown.html2markdown;
import {WikiLinksToHTML} from "./WikiLinksToHTML";
import {WikiLinksToMarkdown} from "./WikiLinksToMarkdown";
import {Mappers} from "polar-shared/src/util/Mapper";
import {ContentEditableWhitespace} from "./ContentEditableWhitespace";
import {ContentEscaper} from "./ContentEscaper";
import {MarkdownStr} from "polar-shared/src/util/Strings";

const TRACE = false;

function doTrace(name: string,
                 input: string,
                 output: string) {

    if (TRACE) {
        console.log(`${name}: "${input}" => "${output}"`)
    }

}

export const MarkdownContentEscaper: ContentEscaper<MarkdownStr> = {

    escape: input => {

        const markdown = markdown2html(WikiLinksToHTML.escape(input));

        const result = markdown.replace(/^<p>/, '')
                               .replace(/<\/p>\n?$/, '')
                               .trim();

        doTrace('escape', input, result);

        return result;

    },
    unescape: html => {

        const result = Mappers.create(html)
                              .map(ContentEditableWhitespace.trim)
                              .map(html2markdown)
                              .map(WikiLinksToMarkdown.unescape)
                              .collect();

        doTrace('unescape', html, result);

        return result;

    }

}
