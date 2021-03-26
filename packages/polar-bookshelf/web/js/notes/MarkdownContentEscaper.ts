import {ContentEscaper} from "../../../apps/stories/impl/ckeditor5/CKEditor5BalloonEditor";
import {MarkdownToHTML} from "polar-markdown-parser/src/MarkdownToHTML";
import {HTMLToMarkdown} from "polar-markdown-parser/src/HTMLToMarkdown";

import markdown2html = MarkdownToHTML.markdown2html;
import html2markdown = HTMLToMarkdown.html2markdown;
import {WikiLinksToHTML} from "./WikiLinksToHTML";
import {WikiLinksToMarkdown} from "./WikiLinksToMarkdown";
import {Mappers} from "polar-shared/src/util/Mapper";
import {ContentEditableWhitespace} from "./ContentEditableWhitespace";

export const MarkdownContentEscaper: ContentEscaper = {

    escape: input => {

        const markdown = markdown2html(WikiLinksToHTML.escape(input));

        return markdown.replace(/^<p>/, '')
                       .replace(/<\/p>\n?$/, '')
                       .trim();

    },
    unescape: html => {

        return Mappers.create(html)
                      .map(ContentEditableWhitespace.trim)
                      .map(html2markdown)
                      .map(WikiLinksToMarkdown.unescape)
                      .collect();

    }

}
