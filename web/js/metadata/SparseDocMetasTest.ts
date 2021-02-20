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

        const inputDocMeta = DocMetas.create('0x1234', 7500)
        const sparseDocMeta = SparseDocMetas.toSparse(inputDocMeta);

        assert.equal(sparseDocMeta.encodingType, 'sparse');

        const json = JSON.stringify(sparseDocMeta);

        assert.equal(json.length, 394)

    });

    it("verify output same as input", function () {

        const inputDocMeta = DocMetas.create('0x1234', 2)
        const sparseDocMeta = SparseDocMetas.toSparse(inputDocMeta);

        assert.equal(sparseDocMeta.encodingType, 'sparse');

        const outputDocMeta = SparseDocMetas.fromSparse(sparseDocMeta);

        assertJSON(inputDocMeta, outputDocMeta);
        // now verify the output is the same as the input...

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
