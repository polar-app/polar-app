import {MarkdownToHTML} from "polar-markdown-parser/src/MarkdownToHTML";
import {HTMLToMarkdown} from "polar-markdown-parser/src/HTMLToMarkdown";
import markdown2html = MarkdownToHTML.markdown2html;
import html2markdown = HTMLToMarkdown.html2markdown;
import {WikiLinksToHTML} from "./WikiLinksToHTML";
import {WikiLinksToMarkdown} from "./WikiLinksToMarkdown";
import {Mappers} from "polar-shared/src/util/Mapper";
import {ContentEditableWhitespace} from "./ContentEditableWhitespace";
import {MarkdownStr, HTMLStr} from "polar-shared/src/util/Strings";

const TRACE = false;

function doTrace(name: string,
                 input: string,
                 output: string) {

    if (TRACE) {
        console.log(`${name}: "${input}" => "${output}"`)
    }

}

export const MarkdownContentConverter = {

    toHTML: (srcMarkdown: MarkdownStr) => {

        const markdown = markdown2html(WikiLinksToHTML.escape(srcMarkdown));

        const result = markdown.replace(/^<p>/, '')
                               .replace(/<\/p>\n?$/, '')
                               .trim();

        doTrace('toHTML', markdown, result);

        return result;

    },
    toMarkdown: (srcHTML: HTMLStr) => {

        const result = Mappers.create(srcHTML)
                              .map(ContentEditableWhitespace.trim)
                              .map(html2markdown)
                              .map(WikiLinksToMarkdown.unescape)
                              .collect();

        doTrace('toMarkdown', srcHTML, result);

        return result;

    }

}
