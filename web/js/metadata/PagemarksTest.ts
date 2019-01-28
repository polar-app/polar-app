import {assertJSON} from '../test/Assertions';
import {Pagemarks} from "./Pagemarks";
import {DocMetas} from "./DocMetas";
import {TestingTime} from "../test/TestingTime";
import {assert} from 'chai';
import {DocMeta} from './DocMeta';

TestingTime.freeze();

describe('Pagemarks', function() {

    describe('createRange', function() {

        it("for one page", function() {

            const docMeta = DocMetas.create('0x0001', 1);

            Pagemarks.updatePagemarksForRange(docMeta, 1);

            const expected = [
                {
                    "id": "1s2gw2Mkwb",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "type": "SINGLE_COLUMN",
                    "percentage": 100,
                    "column": 0,
                    "rect": {
                        "left": 0,
                        "top": 0,
                        "width": 100,
                        "height": 100
                    },
                    "batch": "1Y9CcEHSxc",
                    "notes": {},
                    "mode": "READ"
                }
            ];

            assertJSON(Object.values(DocMetas.getPageMeta(docMeta, 1).pagemarks), expected);

        });


        it("for two pages", function() {

            const docMeta = DocMetas.create('0x0001', 2);

            Pagemarks.updatePagemarksForRange(docMeta, 2);

            const pagemark1 = [
                {
                    "id": "126nS8PMqF",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "type": "SINGLE_COLUMN",
                    "percentage": 100,
                    "column": 0,
                    "rect": {
                        "left": 0,
                        "top": 0,
                        "width": 100,
                        "height": 100
                    },
                    "batch": "1yNbsiPseh",
                    "notes": {},
                    "mode": "READ"
                }
            ];

            const pagemark2 = [
                {
                    "id": "12QXpSeNoV",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "type": "SINGLE_COLUMN",
                    "percentage": 100,
                    "column": 0,
                    "rect": {
                        "left": 0,
                        "top": 0,
                        "width": 100,
                        "height": 100
                    },
                    "batch": "1yNbsiPseh",
                    "notes": {},
                    "mode": "READ"
                }
            ];


            assertJSON(Object.values(DocMetas.getPageMeta(docMeta, 1).pagemarks), pagemark1);
            assertJSON(Object.values(DocMetas.getPageMeta(docMeta, 2).pagemarks), pagemark2);

        });


        it("for existing", function() {

            const docMeta = DocMetas.create('0x0001', 10);

            Pagemarks.updatePagemark(docMeta, 3, Pagemarks.create({percentage: 100}));

            Pagemarks.updatePagemarksForRange(docMeta, 4);

            const assertPagemark = (pageNum: number) => {

                const pagemarks = Object.values(DocMetas.getPageMeta(docMeta, pageNum).pagemarks);

                assert.equal(pagemarks.length, 1);

                assert.equal(pagemarks[0].percentage, 100);
            };


            assertPagemark(3);
            assertPagemark(4);

        });

        it("for existing large range", function() {

            const docMeta = DocMetas.create('0x0001', 10);

            Pagemarks.updatePagemark(docMeta, 3, Pagemarks.create({percentage: 100}));

            Pagemarks.updatePagemarksForRange(docMeta, 8);

            assertPagemark(docMeta, 3, "1Y9CcEHSxc");

            assertPagemark(docMeta, 4, "1yNbsiPseh");
            assertPagemark(docMeta, 5, "1yNbsiPseh");
            assertPagemark(docMeta, 6, "1yNbsiPseh");
            assertPagemark(docMeta, 7, "1yNbsiPseh");
            assertPagemark(docMeta, 8, "1yNbsiPseh");

        });


        it("for fractional range", function() {

            const docMeta = DocMetas.create('0x0001', 10);

            Pagemarks.updatePagemark(docMeta, 3, Pagemarks.create({percentage: 50}));

            Pagemarks.updatePagemarksForRange(docMeta, 4);

            const pagemarks = Object.values(DocMetas.getPageMeta(docMeta, 3).pagemarks);

            assert.equal(pagemarks.length, 2);

            assert.equal(pagemarks[0].percentage, 50);
            assert.equal(pagemarks[1].percentage, 50);

            assertPagemark(docMeta, 4, "1yNbsiPseh");

        });

    });


});


const assertPagemark = (docMeta: DocMeta, pageNum: number, batch: string) => {

    const pagemarks = Object.values(DocMetas.getPageMeta(docMeta, pageNum).pagemarks);

    assert.equal(pagemarks.length, 1);
    const pagemark = pagemarks[0];
    assert.equal(pagemark.percentage, 100);

    assert.equal(pagemark.batch, batch);

};
