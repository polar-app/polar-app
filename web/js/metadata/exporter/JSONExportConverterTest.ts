import {BufferExportWriter} from './writers/BufferExportWriter';
import {JSONExportConverter} from './JSONExportConverter';
import {Comments} from '../Comments';
import {AnnotationType} from '../AnnotationType';
import {assert} from 'chai';
import {assertJSON} from '../../test/Assertions';
import {TestingTime} from '../../test/TestingTime';

describe('JSONExportConverter', function() {

    it("basic", async function() {

        TestingTime.freeze();

        const writer = new BufferExportWriter();

        const converter = new JSONExportConverter();

        await converter.init(writer);

        const comment = Comments.createTextComment("hello world", 'page:1');

        await converter.convert(writer, {type: AnnotationType.COMMENT, annotation: comment} );

        await converter.close(writer);

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

