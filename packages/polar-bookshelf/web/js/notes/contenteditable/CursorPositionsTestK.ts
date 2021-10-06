import {CursorPositions} from "./CursorPositions";
import {assert} from "chai";
import {Asserts} from "polar-shared/src/Asserts";
import {ContentEditables} from "../ContentEditables";

describe('CursorPositions', () => {
    describe('computeCurrentOffset', () => {
        beforeEach(() => {
            document.body.setAttribute("contenteditable", "true");
        });

        it('should return 0 when there\'s no active selection', () => {
            document.body.innerHTML = "<h1>Hello</h1>";

            const pos = CursorPositions.computeCurrentOffset(document.body);
            assert.equal(pos, 0);
        });

        it('should work with nested html', () => {
            document.body.innerHTML = `<div class="foo">hello<h1><span>world</span></h1></div>`;
            const span = document.querySelector<HTMLSpanElement>("span");
            Asserts.assertPresent(span);
            ContentEditables.setCaretPosition(span, 'start');

            const pos = CursorPositions.computeCurrentOffset(document.body);

            assert.equal(pos, 5);
        });

        it('should work with basic text nodes', () => {
            document.body.innerHTML = `Hello world`;
            const textNode = document.body.firstChild;
            Asserts.assertPresent(textNode);
            ContentEditables.setCaretPosition(textNode, 3);
            const pos = CursorPositions.computeCurrentOffset(document.body);

            assert.equal(pos, 3);
        });

        it('random test case 1', () => {
            document.body.innerHTML = `types<span>are bad</span>`;
            ContentEditables.setCaretPosition(document.body, 1); // The second child of document.body
            const pos = CursorPositions.computeCurrentOffset(document.body);

            assert.equal(pos, 5);
        });

        it('should work with contenteditable false at the end with a space right after', () => {
            document.body.innerHTML = `types<span contenteditable="false">are bad</span> `;
            const span = document.querySelector<HTMLSpanElement>('span');
            Asserts.assertPresent(span);
            ContentEditables.setCaretPosition(span, 'end');
            const pos = CursorPositions.computeCurrentOffset(document.body);

            assert.equal(pos, document.body.textContent!.length - 1);
        });

        it('should work with empty nodes and return "end"', () => {
            document.body.innerHTML = `types<span contenteditable="false"></span> `;
            const span = document.querySelector<HTMLSpanElement>('span');
            Asserts.assertPresent(span);
            ContentEditables.setCaretPosition(span, 'start');
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

    describe('isCursorAtSide', () => {
        beforeEach(() => {
            document.body.setAttribute("contenteditable", "true");
        });

        it('should return false if the cursor is not on the top or bottom edges', () => {
            document.body.innerHTML = `hello</br>world</br>foo`;
            CursorPositions.jumpToPosition(document.body, 7); // Put it within 'world'

            assert.equal(CursorPositions.isCursorAtSide(document.body, 'top'), false);
            assert.equal(CursorPositions.isCursorAtSide(document.body, 'bottom'), false);
        });

        it('should work when checking whether the cursor is in the first line (top)', () => {
            document.body.innerHTML = `hello</br>world</br>foo`;
            CursorPositions.jumpToPosition(document.body, 3); // Put it within 'hello'

            assert.equal(CursorPositions.isCursorAtSide(document.body, 'top'), true);
            assert.equal(CursorPositions.isCursorAtSide(document.body, 'bottom'), false);
        });

        it('should work when checking whether the cursor is in the last line (bottom)', () => {
            document.body.innerHTML = `hello</br>world</br>foo`;
            CursorPositions.jumpToPosition(document.body, 11); // Put it within 'foo'

            assert.equal(CursorPositions.isCursorAtSide(document.body, 'bottom'), true);
            assert.equal(CursorPositions.isCursorAtSide(document.body, 'top'), false);
        });

        it('should work with one liners', () => {
            document.body.innerHTML = `world`;
            CursorPositions.jumpToPosition(document.body, 3); // Put it within 'world'

            assert.equal(CursorPositions.isCursorAtSide(document.body, 'bottom'), true);
            assert.equal(CursorPositions.isCursorAtSide(document.body, 'top'), true);
        });

        it('should work with nested contentEditable=false elements', () => {
            document.body.innerHTML = `world<br/><span contenteditable="false">a wiki link</span>`;
            CursorPositions.jumpToPosition(document.body, 'end'); // Put it within 'a wiki link'

            assert.equal(CursorPositions.isCursorAtSide(document.body, 'bottom'), true);
            assert.equal(CursorPositions.isCursorAtSide(document.body, 'top'), false);
        });

        it('should work when the cursor is at the first character (in a multi-line string)', () => {
            document.body.innerHTML = `hello</br>world</br>foo`;
            CursorPositions.jumpToPosition(document.body, 0);

            assert.equal(CursorPositions.isCursorAtSide(document.body, 'top'), true);
            assert.equal(CursorPositions.isCursorAtSide(document.body, 'bottom'), false);
        });

        it('should work when the cursor is at the last character (in a multi-line string)', () => {
            document.body.innerHTML = `hello</br>world</br>foo`;
            CursorPositions.jumpToPosition(document.body, 'end');

            assert.equal(CursorPositions.isCursorAtSide(document.body, 'bottom'), true);
            assert.equal(CursorPositions.isCursorAtSide(document.body, 'top'), false);
        });
    });
});
