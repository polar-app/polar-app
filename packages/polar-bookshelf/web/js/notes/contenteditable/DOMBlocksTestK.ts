import {assert} from "chai";
import {Asserts} from "polar-shared/src/Asserts";
import {DOMBlocks} from "./DOMBlocks";


describe('DOMBlocks', () => {
    describe('getBlockHTMLID', () => {
        it('should return the correct id', () => {
            assert.equal(DOMBlocks.getBlockHTMLID('123'), 'block-123');
        });
    });

    describe('getBlockElement', () => {
        it('should return the dom element of a block given the ID', () => {
            document.body.innerHTML = `<div id="block-123"></div>`;

            const blockElem = document.querySelector<HTMLDivElement>('#block-123');
            assert.equal(DOMBlocks.getBlockElement('123'), blockElem);
        });
    });

    describe('isBlockElement', () => {
        it('should return true if an element is a block container (has an id that starts with "block-")', () => {
            const id = "block-jflaksdfjlk";
            document.body.innerHTML = `<div id="${id}"></div>`;
            const blockElem = document.querySelector<HTMLDivElement>(`#${id}`);
            Asserts.assertPresent(blockElem);
            assert.equal(DOMBlocks.isBlockElement(blockElem), true);
        });

        it('should return false for non block containers', () => {
            document.body.innerHTML = `<div><p>hello world, fake block</p></div>`;
            const nonBlockElem = document.querySelector<HTMLDivElement>(`p`);
            Asserts.assertPresent(nonBlockElem);
            assert.equal(DOMBlocks.isBlockElement(nonBlockElem), false);
        });
    });

    describe('findSiblingBlock', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div>
                    <div id="block-1"></div>
                </div>
                <div>
                    <div id="block-2"></div>
                </div>
                <div>
                    <div>
                        <div id="block-3"></div>
                        <div>
                            <div id="block-4"></div>
                            <div id="block-5"></div>
                        </div>
                    </div>
                </div>
                <p>
                    <div>
                        <div id="block-6"></div>
                    </div>
                </p>
            `;
        });

        it('should be able to find the next sibling block', () => {
            const initial = DOMBlocks.getBlockElement('1');
            Asserts.assertPresent(initial);
            const nextSibling = DOMBlocks.findSiblingBlock(initial, 'next');

            assert.equal(nextSibling, DOMBlocks.getBlockElement('2'));
        });

        it('should be able to find the next sibling block within nested HTML', () => {
            const initial = DOMBlocks.getBlockElement('2');
            Asserts.assertPresent(initial);
            const nextSibling = DOMBlocks.findSiblingBlock(initial, 'next');

            assert.equal(nextSibling, DOMBlocks.getBlockElement('3'));
        });

        it('should return null when there\'s no next sibling', () => {
            const initial = DOMBlocks.getBlockElement('6');
            Asserts.assertPresent(initial);
            const nextSibling = DOMBlocks.findSiblingBlock(initial, 'next');

            assert.equal(nextSibling, null);
        });

        it('should be able to find the prev sibling block', () => {
            const initial = DOMBlocks.getBlockElement('2');
            Asserts.assertPresent(initial);
            const nextSibling = DOMBlocks.findSiblingBlock(initial, 'prev');

            assert.equal(nextSibling, DOMBlocks.getBlockElement('1'));
        });

        it('should be able to find the prev sibling block within nested HTML', () => {
            const initial = DOMBlocks.getBlockElement('6');
            Asserts.assertPresent(initial);
            const nextSibling = DOMBlocks.findSiblingBlock(initial, 'prev');

            assert.equal(nextSibling, DOMBlocks.getBlockElement('5'));
        });

        it('should return null when there\'s no prev sibling', () => {
            const initial = DOMBlocks.getBlockElement('1');
            Asserts.assertPresent(initial);
            const nextSibling = DOMBlocks.findSiblingBlock(initial, 'prev');

            assert.equal(nextSibling, null);
        });
    });
});
