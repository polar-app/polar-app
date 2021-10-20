import {MarkdownToHTML} from "polar-markdown-parser/src/MarkdownToHTML";
import {HTMLToMarkdown} from "polar-markdown-parser/src/HTMLToMarkdown";
import {WikiLinksToHTML} from "./WikiLinksToHTML";
import {Mappers} from "polar-shared/src/util/Mapper";
import {HTMLStr, MarkdownStr} from "polar-shared/src/util/Strings";
import {Elements} from "../util/Elements";
import markdown2html = MarkdownToHTML.markdown2html;
import html2markdown = HTMLToMarkdown.html2markdown;

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
        const whitespaceCount = getWhitespaceCount(html);

        const markdown = markdown2html(escaped.trim());

        // TODO/FIXME we only handle &quot; now and not ALL HTML entities...
        // https://github.com/markedjs/marked/discussions/1737

        const result = markdown.replace(/^<p>/g, '')
                               .replace(/<\/p>\n?$/g, '')
                               .replace(/&quot;/g, '"')
                               .replace(/&amp;/g, '&')
                               .trim();

        doTrace('toHTML', markdown, result);

        return restoreWhitespace(result, whitespaceCount);
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

    type WhitespaceCount = {
        start: number;
        end: number;
    };

    function getWhitespaceCount(el: HTMLElement): WhitespaceCount {
        const target = el.cloneNode(true);

        target.normalize();

        const nodes = getTextNodesIn(target);

        const countSpaces = (node: Node | null, location: 'start' | 'end'): number => {
            if (! node || ! node.textContent) {
                return 0;
            }

            const match = node.textContent.match(location === 'start' ? /^ +/ : / +$/);

            if (! match) {
                return 0;
            }

            return match[0].length;
        };

        return {
            start: countSpaces(nodes[0], 'start'),
            end: countSpaces(nodes[nodes.length - 1], 'end'),
        };
    }

    function restoreWhitespace(str: string, { start, end }: WhitespaceCount): string {
        return `${' '.repeat(start)}${str}${' '.repeat(end)}`;
    }

    export function toMarkdown(srcHTML: HTMLStr) {
        const whitespaceCount = getWhitespaceCount(Elements.createWrapperElementHTML(srcHTML));

        const result = Mappers.create(srcHTML)
                              .map(html2markdown)
                              .map(WikiLinksToHTML.unescape)
                              .collect();

        doTrace('toMarkdown', srcHTML, result);

        return restoreWhitespace(result, whitespaceCount);

    }

}
