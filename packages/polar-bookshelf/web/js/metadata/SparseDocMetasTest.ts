import {assert} from 'chai';
import { IDimensions } from 'polar-shared/src/util/IDimensions';
import { assertJSON } from '../test/Assertions';
import { DocMetas } from "./DocMetas";
import {SparseDimensions, SparseDocMetas} from "./SparseDocMetas";

describe('SparseDocMetas', function() {

    it("size without making sparse", function () {

        const docMeta = DocMetas.create('0x1234', 7500);

        const json = DocMetas.serialize(docMeta);

        assert.equal(json.length, 2353203)

    });

    it("size as sparse", function () {

        // TODO: I can write a completely *new* file format that keeps the data.

        // TODO: this new version is ONLY about 4x smaller.. which is great but
        // doesn't really make it TOO sparse
        //
        // TODO: I could use jszip but it doesn't use a web worker... which is a
        // big fucking problem - it should use one automatically.
        //
        // the dimensions are the main issue... I can store these in a different
        // index and re-encode it on deserialization.

        const docMeta = SparseDocMetas.toSparse(DocMetas.create('0x1234', 7500));

        // const json = DocMetas.serialize(docMeta, "  ");
        //
        // console.log("FIXME: ", json);
        //
        // assert.equal(json.length, 515703)

    });

    describe('SparseDimensions', function() {

        it("basic", function () {

            const input: IDimensions = {
                width: 800,
                height: 600
            };

            assert.equal(SparseDimensions.toSparse(input), '800x600');

            assertJSON(SparseDimensions.fromSparse('800x600'), input);

        });

    });

});
