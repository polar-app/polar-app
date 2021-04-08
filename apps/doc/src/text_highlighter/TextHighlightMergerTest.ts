import {Rect} from '../../../../web/js/Rect';
import {assert} from 'chai';
import {TextHighlightMerger} from './TextHighlightMerger';
import {IRect} from 'polar-shared/src/util/rects/IRect';

const TEST_DATA = [
    /*
     * File: p761-thompson.pdf
     * Page: 1 (top)
     * Text: To what extent should one trust a statement that a program is free of Trojan
     * horses? Perhaps it is mor
     */
    {
        input: `[{"left":196,"top":165,"right":216,"bottom":184,"width":20,"height":18},{"left":217,"top":165,"right":254,"bottom":184,"width":36,"height":18},{"left":256,"top":165,"right":300,"bottom":184,"width":43,"height":18},{"left":301,"top":165,"right":349,"bottom":184,"width":47,"height":18},{"left":350,"top":165,"right":376,"bottom":184,"width":26,"height":18},{"left":378,"top":165,"right":413,"bottom":184,"width":34,"height":18},{"left":414,"top":165,"right":425,"bottom":184,"width":10,"height":18},{"left":426,"top":165,"right":494,"bottom":184,"width":67,"height":18},{"left":496,"top":165,"right":526,"bottom":184,"width":29,"height":18},{"left":527,"top":165,"right":538,"bottom":184,"width":10,"height":18},{"left":540,"top":165,"right":598,"bottom":184,"width":58,"height":18},{"left":600,"top":165,"right":615,"bottom":184,"width":14,"height":18},{"left":615,"top":165,"right":644,"bottom":184,"width":29,"height":18},{"left":645,"top":165,"right":663,"bottom":184,"width":17,"height":18},{"left":663,"top":165,"right":710,"bottom":184,"width":46,"height":18},{"left":196,"top":183,"right":247,"bottom":202,"width":51,"height":18},{"left":250,"top":183,"right":307,"bottom":202,"width":56,"height":18},{"left":312,"top":183,"right":325,"bottom":202,"width":13,"height":18},{"left":330,"top":183,"right":344,"bottom":202,"width":13,"height":18},{"left":349,"top":183,"right":374,"bottom":202,"width":24,"height":18}]`,
        output: `[{"left":196,"top":165,"right":710,"bottom":184,"width":514,"height":19},{"left":196,"top":183,"right":374,"bottom":202,"width":178,"height":19}]`,
    },

    /*
     * File: p761-thompson.pdf
     * Page: 1 (bottom)
     * Text: ©1984 0001-0782/84/0800-0761 75¢
     */
    {
        input: `[{"left":81,"top":932,"right":112,"bottom":942,"width":31,"height":10},{"left":113,"top":929,"right":223,"bottom":942,"width":110,"height":13},{"left":221,"top":932,"right":238,"bottom":942,"width":16,"height":10}]`,
        output: `[{"left":81,"top":929,"right":238,"bottom":942,"width":157,"height":13}]`,
    },

    /*
     * File: chubby.pdf
     * Page: 10 (middle right)
     * Text: Npartitions, each of which has a set of replicas and amaster.
     * Every nodeD/Cin directoryDwould be storedon the partitionP(D/C)=hash(D)mod...
     */
    {
        input: `[{"left":419,"top":642,"right":429,"bottom":658,"width":9,"height":15},{"left":436,"top":643,"right":488,"bottom":658,"width":52,"height":15},{"left":488,"top":643,"right":722,"bottom":658,"width":234,"height":15},{"left":419,"top":659,"right":523,"bottom":674,"width":103,"height":15},{"left":525,"top":658,"right":534,"bottom":674,"width":9,"height":15},{"left":536,"top":658,"right":540,"bottom":674,"width":3,"height":15},{"left":543,"top":658,"right":552,"bottom":674,"width":9,"height":15},{"left":557,"top":659,"right":619,"bottom":674,"width":61,"height":15},{"left":621,"top":658,"right":631,"bottom":674,"width":9,"height":15},{"left":636,"top":659,"right":720,"bottom":674,"width":84,"height":15},{"left":419,"top":675,"right":502,"bottom":690,"width":82,"height":15},{"left":505,"top":674,"right":514,"bottom":690,"width":8,"height":15},{"left":515,"top":674,"right":520,"bottom":690,"width":4,"height":15},{"left":520,"top":674,"right":548,"bottom":690,"width":27,"height":15},{"left":549,"top":674,"right":569,"bottom":690,"width":19,"height":15},{"left":573,"top":675,"right":601,"bottom":690,"width":28,"height":15},{"left":601,"top":674,"right":605,"bottom":690,"width":4,"height":15},{"left":606,"top":674,"right":615,"bottom":690,"width":9,"height":15},{"left":617,"top":674,"right":622,"bottom":690,"width":4,"height":15},{"left":626,"top":675,"right":647,"bottom":690,"width":21,"height":15},{"left":650,"top":674,"right":659,"bottom":690,"width":9,"height":15},{"left":662,"top":675,"right":720,"bottom":690,"width":58,"height":15},{"left":419,"top":691,"right":510,"bottom":706,"width":90,"height":15},{"left":512,"top":690,"right":521,"bottom":706,"width":9,"height":15},{"left":526,"top":691,"right":722,"bottom":706,"width":196,"height":15},{"left":419,"top":706,"right":428,"bottom":722,"width":8,"height":15},{"left":430,"top":706,"right":434,"bottom":722,"width":4,"height":15},{"left":435,"top":706,"right":445,"bottom":722,"width":9,"height":15},{"left":446,"top":706,"right":466,"bottom":722,"width":19,"height":15},{"left":469,"top":707,"right":497,"bottom":722,"width":28,"height":15},{"left":497,"top":706,"right":502,"bottom":722,"width":4,"height":15},{"left":502,"top":706,"right":512,"bottom":722,"width":9,"height":15},{"left":514,"top":705,"right":519,"bottom":716,"width":5,"height":10},{"left":517,"top":706,"right":522,"bottom":722,"width":4,"height":15},{"left":526,"top":707,"right":547,"bottom":722,"width":21,"height":15},{"left":550,"top":706,"right":560,"bottom":722,"width":9,"height":15},{"left":562,"top":707,"right":602,"bottom":722,"width":39,"height":15},{"left":604,"top":706,"right":614,"bottom":722,"width":9,"height":15},{"left":616,"top":705,"right":621,"bottom":716,"width":5,"height":10},{"left":623,"top":707,"right":703,"bottom":722,"width":79,"height":15},{"left":705,"top":706,"right":715,"bottom":722,"width":9,"height":15},{"left":716,"top":707,"right":720,"bottom":722,"width":4,"height":15}]`,
        output: `[{"top":642,"bottom":658,"left":419,"right":722,"width":303,"height":16},{"top":658,"bottom":690,"left":419,"right":720,"width":301,"height":32},{"top":690,"bottom":706,"left":419,"right":722,"width":303,"height":16},{"top":706,"bottom":722,"left":419,"right":512,"width":93,"height":16},{"left":514,"top":705,"right":519,"bottom":716,"width":5,"height":10},{"top":706,"bottom":722,"left":517,"right":614,"width":97,"height":16},{"left":616,"top":705,"right":621,"bottom":716,"width":5,"height":10},{"top":706,"bottom":722,"left":623,"right":720,"width":97,"height":16}]`
    },

    /*
     * File: availability.pdf
     * Page: 13 (top right)
     * Text:  JAVADI,  B.,  KONDO,  D.,  VINCENT,  J.-M.,ANDANDERSON,D.
     * Mining  for  statistical  models  of  availability  in  large-scaledistributed
     * systems:  An empirical study of SETI@home (2009).pp. 1–10.
     * 
     */
    {
        input: `[{"left":444,"top":269,"right":449,"bottom":281,"width":4,"height":11},{"left":448,"top":271,"right":476,"bottom":281,"width":27,"height":9},{"left":476,"top":269,"right":509,"bottom":281,"width":32,"height":11},{"left":508,"top":271,"right":535,"bottom":281,"width":26,"height":9},{"left":535,"top":269,"right":569,"bottom":281,"width":33,"height":11},{"left":569,"top":271,"right":603,"bottom":281,"width":34,"height":9},{"left":602,"top":269,"right":637,"bottom":281,"width":35,"height":11},{"left":641,"top":271,"right":661,"bottom":281,"width":19,"height":9},{"left":665,"top":269,"right":672,"bottom":281,"width":7,"height":11},{"left":673,"top":271,"right":717,"bottom":281,"width":43,"height":9},{"left":717,"top":269,"right":720,"bottom":281,"width":3,"height":11},{"left":444,"top":281,"right":725,"bottom":293,"width":280,"height":11},{"left":444,"top":294,"right":724,"bottom":306,"width":279,"height":11},{"left":444,"top":307,"right":484,"bottom":319,"width":40,"height":11}]`,
        output: `[{"top":269,"bottom":281,"left":444,"right":720,"width":276,"height":12},{"left":444,"top":281,"right":725,"bottom":293,"width":280,"height":11},{"left":444,"top":294,"right":724,"bottom":306,"width":279,"height":11},{"left":444,"top":307,"right":484,"bottom":319,"width":40,"height":11}]`,
    },
    /*
     * File: availability
     * Page: 1 (top)
     * Text: {ford,flab,florentina,mstokely}@google.com, vatruong@ieor.columbia.edu{luiz,cgrimes,sean}@google.com
     */
    {
        input: `[{"left":157,"top":242,"right":165,"bottom":257,"width":7,"height":14},{"left":164,"top":242,"right":374,"bottom":257,"width":210,"height":14},{"left":372,"top":242,"right":379,"bottom":257,"width":7,"height":14},{"left":378,"top":242,"right":661,"bottom":257,"width":282,"height":14},{"left":301,"top":261,"right":308,"bottom":275,"width":7,"height":14},{"left":307,"top":261,"right":430,"bottom":275,"width":123,"height":14},{"left":429,"top":261,"right":436,"bottom":275,"width":7,"height":14},{"left":435,"top":261,"right":515,"bottom":275,"width":79,"height":14}]`,
        output: `[{"top":242,"bottom":257,"left":157,"right":661,"width":504,"height":15},{"top":261,"bottom":275,"left":301,"right":515,"width":214,"height":14}]`,
    }
];

const jsonToRects = (obj: string): Rect[] => JSON.parse(obj);

describe('TextHighlightMerger', () => {
    describe('canMergeX', () => {
        /*      
         * --------  -----
         * |  a   |  | b |
         * --------  -----
         *
         */
        it('Should allow merging Left/Right rects - Same top & bottom position - 10px X gap', () => {
            const a = {
                left   : 234,
                top    : 528,
                right  : 247,
                bottom : 543,
                width  : 13,
                height : 15,
            };
            const b = {
                left   : 256,
                top    : 528,
                right  : 267,
                bottom : 543,
                width  : 11,
                height : 15,
            };
            
            assert.strictEqual(TextHighlightMerger.canMergeX(a, b, [10, 0]), true);
            assert.strictEqual(TextHighlightMerger.canMergeX(b, a, [10, 0]), true);
        });

        /*      
         * --------    --------
         * |  a   |    |  b   |
         * --------    --------
         *
         */
        it('Should not allow merging Left/Right rects - Same top & bottom position - 40px X gap', () => {
            const a = {
                left   : 234,
                top    : 528,
                right  : 260,
                bottom : 543,
                width  : 126,
                height : 15,
            };
            const b = {
                left   : 300,
                top    : 528,
                right  : 367,
                bottom : 543,
                width  : 67,
                height : 15,
            };

            assert.strictEqual(TextHighlightMerger.canMergeX(a, b, [0, 30]), false);
            assert.strictEqual(TextHighlightMerger.canMergeX(b, a, [0, 30]), false);
        });


        /*
         *    ------
         * ---|--  |
         * |  --|---
         * ------
         *
         */
        it('Should allow merging two rectangles with one slightly shifted top right by 10px in both dirs', () => {
            const a = {
                left   : 200,
                right  : 400,
                width  : 200,
                top    : 460,
                bottom : 490,
                height : 30,
            };
            const b = {
                left   : 390,
                right  : 500,
                width  : 120,
                top    : 450,
                bottom : 480,
                height : 30,
            };

            assert.strictEqual(TextHighlightMerger.canMergeX(a, b, [10, 30]), true);
            assert.strictEqual(TextHighlightMerger.canMergeX(b, a, [10, 30]), true);
        });

        it('Should allow merging random test 1', () => {
            const a = new Rect({
                bottom : 325,
                height : 35,
                left   : 307,
                right  : 472,
                top    : 290,
                width  : 165,
            });

            const b = new Rect({
                bottom : 334,
                height : 40,
                left   : 389,
                right  : 500,
                top    : 294,
                width  : 111,
            });

            assert.strictEqual(TextHighlightMerger.canMergeX(a, b, [10, 20]), true);
            assert.strictEqual(TextHighlightMerger.canMergeX(b, a, [10, 20]), true);
        });

        it('Should allow merging random test 2', () => {
            const a = new Rect({
                bottom: 498.265625,
                height: 38,
                left: 877.640625,
                right: 895.53125,
                top: 460.265625,
                width: 17.890625,
            });

            const b = new Rect({
                bottom: 496.359375,
                height: 30,
                left: 898.71875,
                right: 974.8060302734375,
                top: 466.359375,
                width: 76.0872802734375,
            });

            assert.strictEqual(TextHighlightMerger.canMergeX(a, b, [3.5, 11]), true);
            assert.strictEqual(TextHighlightMerger.canMergeX(b, a, [3.5, 11]), true);
        });
    });


    describe('canMergeY', () => {

        /*
         * ------
         * |    |
         * ------
         * ------
         * |    |
         * ------
         */
        it('Should allow merging 2 rectangles that are on top of eachother that have the same width with some leeway', () => {
            const a = {
                top    : 350,
                bottom : 400,
                height : 50,
                left   : 50,
                right  : 760,
                width  : 710,
            };
            const b = {
                top    : 400,
                bottom : 450,
                height : 50,
                left   : 50,
                right  : 760,
                width  : 710,
            };

            assert.strictEqual(TextHighlightMerger.canMergeY(a, b, [0, 5]), true);
            assert.strictEqual(TextHighlightMerger.canMergeY(b, a, [0, 5]), true);
        });
        
        it('Should allow merging random test 1', () => {
            const a = {
                bottom : 397,
                height : 23,
                left   : 59,
                right  : 760,
                top    : 374,
                width  : 700,
            };
            const b = {
                bottom : 420,
                height : 23,
                left   : 59,
                right  : 760,
                top    : 397,
                width  : 702,
            };

            assert.strictEqual(TextHighlightMerger.canMergeY(a, b, [0, 7]), true);
            assert.strictEqual(TextHighlightMerger.canMergeY(b, a, [0, 7]), true);
        });

        it('Should allow merging random test 2', () => {
            const a = {
                bottom : 882,
                height : 23,
                left   : 59,
                right  : 759,
                top    : 859,
                width  : 699,
            };

            const b = {
                bottom : 905,
                height : 23,
                left   : 59,
                right  : 759,
                top    : 882,
                width  : 701,
            };

            assert.strictEqual(TextHighlightMerger.canMergeY(a, b, [0, 7]), true);
            assert.strictEqual(TextHighlightMerger.canMergeY(b, a, [0, 7]), true);
        });
    });

    describe('avgRectsHeight', () => {
        it('Should return 0 when provided with an empty array', () => {
            assert.equal(TextHighlightMerger.avgRectsHeight([]), 0);
        });
        it('Should get the average height of rectangles', () => {
            const rects: ReadonlyArray<IRect> = [
                new Rect({
                    bottom : 882,
                    height : 23,
                    left   : 59,
                    right  : 759,
                    top    : 859,
                    width  : 699,
                }),
                new Rect({
                    bottom : 900,
                    height : 18,
                    left   : 59,
                    right  : 759,
                    top    : 882,
                    width  : 701,
                }),
            ];

            assert.equal(TextHighlightMerger.avgRectsHeight(rects), 20.5);
        });
    });

    describe('mergeRects', () => {
        it('Should merge two rectangles and return a new rectangle that contains both of them', () => {
            const a = {
                bottom : 882,
                height : 23,
                left   : 59,
                right  : 759,
                top    : 859,
                width  : 699,
            };

            const b = {
                bottom : 905,
                height : 23,
                left   : 59,
                right  : 761,
                top    : 882,
                width  : 701,
            };

            const result = {
                bottom : 905,
                top    : 859,
                left   : 59,
                right  : 761,
                width  : 702,
                height : 46,
            };
            assert.deepEqual(TextHighlightMerger.mergeRects(b, a), result);
        });
    });

    describe('groupBySorted', () => {
        it('Should group adjacent elements', () => {
            const arr = [2, 4, 5, 8, 10, 7, 11];
            const actual = TextHighlightMerger.groupAdjacent(arr, (a, b) => a % 2 === b % 2);
            const expected = [[2, 4], [5], [8, 10], [7, 11]];
            assert.deepEqual(expected, actual);
        });

        it('Should return an empty array when provided with one', () => {
            assert.deepEqual(TextHighlightMerger.groupAdjacent([], () => true), []);
        });

        it('Should return a group that contains one element if the provided array has a length of 1', () => {
            assert.deepEqual(TextHighlightMerger.groupAdjacent([1], () => true), [[1]]);
        });
    });

    describe('merge', () => {
        it('Should work with empty arrays', () => {
            assert.deepEqual(TextHighlightMerger.merge([]), []);
        });

        it('Should work with arrays that have one element', () => {
            const a = {
                left   : 200,
                right  : 400,
                width  : 200,
                top    : 460,
                bottom : 490,
                height : 30,
            };
            assert.deepEqual(TextHighlightMerger.merge([a]), [a]);
        });

        it('Should merge recursively random test 1', () => {
            const a = {
                left   : 200,
                right  : 400,
                width  : 200,
                top    : 460,
                bottom : 490,
                height : 30,
            };
            const b = {
                left   : 390,
                right  : 500,
                width  : 120,
                top    : 450,
                bottom : 480,
                height : 30,
            };

            const result = {
                left   : 200,
                right  : 500,
                width  : 300,
                top    : 450,
                bottom : 490,
                height : 40,
            };

            assert.deepEqual(TextHighlightMerger.merge([a, b]), [result]);
        });

        it('Should merge recursively random test 2', () => {
            const arr = [
                new Rect({
                    bottom : 580,
                    height : 15,
                    left   : 241,
                    right  : 704,
                    top    : 565,
                    width  : 463,
                }),
                new Rect({
                    bottom : 597,
                    height : 15,
                    left   : 241,
                    right  : 704,
                    top    : 582,
                    width  : 463,
                }),
                new Rect({
                    bottom : 615,
                    height : 15,
                    left   : 241,
                    right  : 414,
                    top    : 599,
                    width  : 172,
                })
            ];

            const result = [
                {
                    bottom : 597,
                    height : 32,
                    left   : 241,
                    right  : 704,
                    top    : 565,
                    width  : 463,
                },
                {
                    bottom : 615,
                    height : 15,
                    left   : 241,
                    right  : 414,
                    top    : 599,
                    width  : 172,
                }
            ];

            assert.deepEqual(TextHighlightMerger.merge(arr), result);
        });

        for (let i = 0; i < TEST_DATA.length; i += 1) {
            it(`Random test case ${i + 1}`, () => {
                const { input, output } = TEST_DATA[i];
                assert.deepEqual(TextHighlightMerger.merge(jsonToRects(input)), jsonToRects(output));
            });
        }
    });
});
