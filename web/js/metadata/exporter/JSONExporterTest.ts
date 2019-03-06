import {BufferWriter} from './writers/BufferWriter';
import {JSONExporter} from './JSONExporter';
import {Comments} from '../Comments';
import {AnnotationType} from '../AnnotationType';
import {assert} from 'chai';
import {assertJSON} from '../../test/Assertions';
import {TestingTime} from '../../test/TestingTime';

describe('JSONExporter', function() {

    it("basic with one item", async function() {

        TestingTime.freeze();

        const writer = new BufferWriter();

        const converter = new JSONExporter();

        await converter.init(writer);

        const comment = Comments.createTextComment("hello world", 'page:1');

        await converter.write({type: AnnotationType.COMMENT, annotation: comment} );

        await converter.close();

        const expected = {
            "version": 1,
            "items": [
                {
                    "id": "12tPgPJ9QP",
                    "guid": "12tPgPJ9QP",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "content": {
                        "TEXT": "hello world"
                    },
                    "ref": "page:1"
                }
            ]

        };

        assertJSON(writer.toString(), expected);

    });


    it("with two items", async function() {

        TestingTime.freeze();

        const writer = new BufferWriter();

        const converter = new JSONExporter();

        await converter.init(writer);

        const comment0 = Comments.createTextComment("hello world", 'page:1');
        await converter.write({type: AnnotationType.COMMENT, annotation: comment0} );

        const comment1 = Comments.createTextComment("hello world", 'page:1');
        await converter.write({type: AnnotationType.COMMENT, annotation: comment1} );

        await converter.close();

        const expected = {
            "items": [
                {
                    "content": {
                        "TEXT": "hello world"
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "guid": "12tPgPJ9QP",
                    "id": "12tPgPJ9QP",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "ref": "page:1"
                },
                {
                    "content": {
                        "TEXT": "hello world"
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "guid": "12XMbYpxLx",
                    "id": "12XMbYpxLx",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "ref": "page:1"
                }
            ],
            "version": 1
        };

        assertJSON(writer.toString(), expected);

    });


});

