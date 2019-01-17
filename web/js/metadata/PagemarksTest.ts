import {assertJSON} from '../test/Assertions';
import {Pagemarks} from "./Pagemarks";
import {DocMetas} from "./DocMetas";
import {TestingTime} from "../test/TestingTime";

TestingTime.freeze();

describe('Pagemarks', function() {

    describe('createRange', function() {

        it("for one page", function() {

            const docMeta = DocMetas.create('0x0001', 1);

            Pagemarks.createRange(docMeta, 1);

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
                    "notes": {},
                    "mode": "READ"
                }
            ];

            assertJSON(Object.values(DocMetas.getPageMeta(docMeta, 1).pagemarks), expected);

        });


        it("for two page", function() {

            const docMeta = DocMetas.create('0x0001', 2);

            Pagemarks.createRange(docMeta, 2);

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
                    "notes": {},
                    "mode": "READ"
                }
            ];


            assertJSON(Object.values(DocMetas.getPageMeta(docMeta, 1).pagemarks), pagemark1);
            assertJSON(Object.values(DocMetas.getPageMeta(docMeta, 2).pagemarks), pagemark2);

        });
    });


});
