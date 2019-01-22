import {BufferWriter} from './writers/BufferWriter';
import {JSONExporter} from './JSONExporter';
import {Comments} from '../Comments';
import {AnnotationType} from '../AnnotationType';
import {assert} from 'chai';
import {assertJSON} from '../../test/Assertions';
import {TestingTime} from '../../test/TestingTime';

describe('JSONExporter', function() {

    it("basic", async function() {

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


});

