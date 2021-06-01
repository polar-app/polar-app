import {CursorPositions} from "./CursorPositions";
import {assert} from "chai";
import {Asserts} from "polar-shared/src/Asserts";

describe('CursorPositions', () => {
    describe('computeCurrentOffset', () => {
        const setCaretPosition = (elem: Node, position: 'start' | 'end' | number) => {
            const range = new Range();
            switch (position) {
                case 'start':
                    range.setStartBefore(elem);
                    range.setEndBefore(elem);
                    break;
                case 'end':
                    range.setStartAfter(elem);
                    range.setEndAfter(elem);
                    break;
                default:
                    range.setStart(elem, position);
                    range.setStart(elem, position);
                    break;
            }
            const selection = document.getSelection();
            Asserts.assertPresent(selection);

            selection.removeAllRanges();
            selection.addRange(range);

        };

        beforeEach(() => {
            document.body.setAttribute("contenteditable", "true");
        });

        it('should return end when there\'s no active selection', () => {
            document.body.innerHTML = "<h1>Hello</h1>";

            const pos = CursorPositions.computeCurrentOffset(document.body);
            assert.equal(pos, 'end');
        });

        it('should work with nested html', () => {
            document.body.innerHTML = `<div class="foo">hello<h1><span>world</span></h1></div>`;
            const span = document.querySelector<HTMLSpanElement>("span");
            Asserts.assertPresent(span);
            setCaretPosition(span, 'start');
            const pos = CursorPositions.computeCurrentOffset(document.body);

            assert.equal(pos, 5);
        });

        it('should work with basic text nodes', () => {
            document.body.innerHTML = `Hello world`;
            const textNode = document.body.firstChild;
            Asserts.assertPresent(textNode);
            setCaretPosition(textNode, 3);
            const pos = CursorPositions.computeCurrentOffset(document.body);

            assert.equal(pos, 3);
        });

        it('random test case 1', () => {
            document.body.innerHTML = `types<span>are bad</span>`;
            setCaretPosition(document.body, 1); // The second child of document.body
            const pos = CursorPositions.computeCurrentOffset(document.body);

            assert.equal(pos, 5);
        });

        it('should work with contenteditable false at the end with a space right after', () => {
            document.body.innerHTML = `types<span contenteditable="false">are bad</span> `;
            const span = document.querySelector<HTMLSpanElement>('span');
            Asserts.assertPresent(span);
            setCaretPosition(span, 'end');
            const pos = CursorPositions.computeCurrentOffset(document.body);

            assert.equal(pos, document.body.textContent!.length - 1);
        });

        it('should work with empty nodes and return "end"', () => {
            document.body.innerHTML = `types<span contenteditable="false"></span> `;
            const span = document.querySelector<HTMLSpanElement>('span');
            Asserts.assertPresent(span);
            setCaretPosition(span, 'start');
            const pos = CursorPositions.computeCurrentOffset(document.body);

            assert.equal(pos, 'end');
        });
    });

    describe('jumpToPosition', () => {
        it('should work with basic html', () => {
            document.body.innerHTML = `types<span>are bad</span>`;

            CursorPositions.jumpToPosition(document.body, 7);

            const pos = CursorPositions.computeCurrentOffset(document.body);
            assert.equal(pos, 7);
        });

        it('should work with complex nested html', () => {
            document.body.innerHTML = `types<span contenteditable="false">are bad</span><h1><span>world</span></h1>`;

            CursorPositions.jumpToPosition(document.body, 15);

            const pos = CursorPositions.computeCurrentOffset(document.body);
            assert.equal(pos, 15);
        });
    });
});
