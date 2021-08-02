import {MarkdownToHTML} from "polar-markdown-parser/src/MarkdownToHTML";
import {HTMLToMarkdown} from "polar-markdown-parser/src/HTMLToMarkdown";
import markdown2html = MarkdownToHTML.markdown2html;
import html2markdown = HTMLToMarkdown.html2markdown;
import {WikiLinksToHTML} from "./WikiLinksToHTML";
import {WikiLinksToMarkdown} from "./WikiLinksToMarkdown";
import {Mappers} from "polar-shared/src/util/Mapper";
import {MarkdownStr, HTMLStr} from "polar-shared/src/util/Strings";
import {Elements} from "../util/Elements";

const TRACE = false;

function doTrace(name: string,
                 input: string,
                 output: string) {

    if (TRACE) {
        console.log(`${name}: "${input}" => "${output}"`)
    }

}

export namespace MarkdownContentConverter {

    export function toHTML(srcMarkdown: MarkdownStr) {

        const escaped = WikiLinksToHTML.escape(srcMarkdown);
        const html = Elements.createWrapperElementHTML(escaped);
        const markdown = markdown2html(normalizeWhiteSpace(html).innerHTML);

        // TODO/FIXME we only handle &quot; now and not ALL HTML entities...
        // https://github.com/markedjs/marked/discussions/1737

        const rawResult = markdown.replace(/^<p>/g, '')
                               .replace(/<\/p>\n?$/g, '')
                               .replace(/&quot;/g, '"')
                               .replace(/&amp;/g, '&')
                               .trim();

        const result = rawResult.replace(new RegExp('\ufffd', 'g'), ' ')

        doTrace('toHTML', markdown, result);

        return result;

    }

    export function toText(srcMarkdown: MarkdownStr) {
        const html = toHTML(srcMarkdown);
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.innerText;
    }

    export function getTextNodesIn(el: HTMLElement | Text | Node) {
        const textNodes: Text[] = [];
        if (el.nodeType === 3) {
            textNodes.push(el as Text);
        } else {
            const children = el.childNodes;
            for (let i in children) {
                textNodes.push(...getTextNodesIn(children[i]));
            }
        }
        return textNodes;
    }

    function normalizeWhiteSpace(el: HTMLElement) {
        const target = el.cloneNode(true) as HTMLElement;
        
        target.normalize();

        const nodes = getTextNodesIn(target);
        for (let i in nodes) {
            if (nodes[i].textContent) {
                nodes[i].textContent = nodes[i].textContent?.replace(/ /g, '\ufffd') || '';
            }
        }

        return target;
    }

    export function toMarkdown(srcHTML: HTMLStr) {
        const html = normalizeWhiteSpace(Elements.createWrapperElementHTML(srcHTML));

        const rawResult = Mappers.create(html.innerHTML)
                              .map(html2markdown)
                              .map(WikiLinksToMarkdown.unescape)
                              .collect();

        const result = rawResult.replace(new RegExp('\ufffd', 'g'), ' ');

        doTrace('toMarkdown', srcHTML, result);

        return result;

    }

}
