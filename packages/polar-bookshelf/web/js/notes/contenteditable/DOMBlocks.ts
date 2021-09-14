import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {NavPosition} from "../store/BlocksStore";
import {CursorPositions} from "./CursorPositions";

export namespace DOMBlocks {
    export type MarkdownStyle = 'bold' | 'italic';
    export const BLOCK_ID_PREFIX = 'block-';

    export const getBlockHTMLID = (id: BlockIDStr) => `${BLOCK_ID_PREFIX}${id}`;

    export const getBlockElement = (id: BlockIDStr) =>
        document.querySelector<HTMLDivElement>(`#${getBlockHTMLID(id)}`);

    export function isBlockElement(node: Node): node is HTMLDivElement {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.id && element.id.startsWith(BLOCK_ID_PREFIX)) {
                return true;
            }
        }
        return false;
    }

    export function findBlockParent(node: Node | null): HTMLDivElement | null {
        if (! node) {
            return null;
        }

        return isBlockElement(node) ? node : findBlockParent(node.parentElement);
    };

    export function getFocusedBlock(): HTMLDivElement | null {
        const selection = document.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            return findBlockParent(range.startContainer);
        }

        return null;
    }

    export function getSibling(hook: BlockIDStr | HTMLDivElement, delta: 'next' | 'prev'): HTMLDivElement | null {
        const currBlockElem = typeof hook === 'string' ? getBlockElement(hook) : hook;

        if (currBlockElem) {
            const newActiveBlockElem = findSiblingBlock(currBlockElem, delta);
            if (newActiveBlockElem) {
                return newActiveBlockElem;
            }
        }

        return null;
    }

    export function getSiblingID(hook: BlockIDStr | HTMLDivElement, delta: 'next' | 'prev'): string | null {
        const sibling = getSibling(hook, delta);

        if (sibling && sibling.dataset.id) {
            return sibling.dataset.id;
        }

        return null;
    }

    export function findSiblingBlock(node: Node, delta: 'next' | 'prev'): HTMLDivElement | null {
        const sibling = delta === 'next'
                ? node.nextSibling
                : node.previousSibling;

        if (! sibling) {
            if (node.parentElement) {
                return findSiblingBlock(node.parentElement, delta);
            }
            return null;
        }

        if (sibling.nodeType === Node.ELEMENT_NODE) {
            const siblingElem = sibling as HTMLElement;
            const elements = siblingElem.querySelectorAll<HTMLDivElement>(`[id^="${BLOCK_ID_PREFIX}"]`);
            if (elements.length > 0) {
                const idx = delta === 'next' ? 0 : elements.length - 1;
                return elements[idx];
            }
        }

        if (isBlockElement(sibling)) {
            return sibling;
        }

        return findSiblingBlock(sibling, delta);
    }

    export function applyStyleToBlock(id: BlockIDStr, style: MarkdownStyle) {
        const blockElem = getBlockElement(id);
        if (! blockElem) {
            return;
        }
        const firstChild = blockElem.firstChild;
        const lastChild = blockElem.lastChild;
        const selection = document.getSelection();
        if (selection && firstChild && lastChild) {
            const range = new Range();
            range.setStartBefore(firstChild);
            range.setEndAfter(lastChild);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand(style, false);
        }
    }

    export function getBlockID(elem: HTMLElement) {
        return elem.dataset.id;
    }

    export function nav(delta: 'next' | 'prev', pos?: NavPosition): BlockIDStr | null {
        const activeBlock = DOMBlocks.getFocusedBlock();

        if (! activeBlock) {
            return null;
        }

        const sibling = DOMBlocks.getSibling(activeBlock, delta);

        if (! sibling) {
            // if we can't find a sibling then just go to the start/end of the current block (depending on the delta)
            CursorPositions.jumpToPosition(activeBlock, delta === 'prev' ? 'start' : 'end');
            return null;
        }

        const newPos = pos || CursorPositions.computeCurrentOffset(activeBlock);
        
        CursorPositions.jumpToPosition(sibling, newPos || 'start');

        return getBlockID(sibling) || null;
    }
}
