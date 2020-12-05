import {ContentEscaper} from "../../../apps/stories/impl/ckeditor5/CKEditor5BalloonEditor";
import {MarkdownToHTML} from "polar-markdown-parser/src/MarkdownToHTML";
import {HTMLToMarkdown} from "polar-markdown-parser/src/HTMLToMarkdown";

import markdown2html = MarkdownToHTML.markdown2html;
import html2markdown = HTMLToMarkdown.html2markdown;
import {WikiLinksToHTML} from "./WikiLinksToHTML";
import {WikiLinksToMarkdown} from "./WikiLinksToMarkdown";

export const MarkdownContentEscaper: ContentEscaper = {

    escape: input => {

        const markdown = markdown2html(WikiLinksToHTML.escape(input));

        return markdown.replace(/^<p/, '<div')
                       .replace(/<\/p>\n?$/, '</div>')

    },
    unescape: html => {

        const conv0 = html2markdown(html);
        const conv1 = WikiLinksToMarkdown.unescape(conv0);

        return conv1;
    }

}
