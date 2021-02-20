import {assert} from 'chai';
import { IDimensions } from 'polar-shared/src/util/IDimensions';
import { assertJSON } from '../test/Assertions';
import {DocMetas, MockDocMetas} from "./DocMetas";
import {SparseDimensions, SparseDocMetas} from "./SparseDocMetas";

describe('SparseDocMetas', function() {

    it("size without making sparse", function () {

        const docMeta = DocMetas.create('0x1234', 7500);

        const json = DocMetas.serialize(docMeta);

        assert.equal(json.length, 2353203)

    });

    // 394 bytes to 150k...

    it("size as sparse", function () {

        const inputDocMeta = DocMetas.create('0x1234', 7500)
        const sparseDocMeta = SparseDocMetas.toSparse(inputDocMeta);

        assert.equal(sparseDocMeta.encodingType, 'sparse');

        const json = JSON.stringify(sparseDocMeta);

        assert.equal(json.length, 349)

    });

    it("verify output same as input", function () {

        const inputDocMeta = DocMetas.create('0x1234', 2)
        const sparseDocMeta = SparseDocMetas.toSparse(inputDocMeta);

        assert.equal(sparseDocMeta.encodingType, 'sparse');

        const outputDocMeta = SparseDocMetas.fromSparse(sparseDocMeta);

        assertJSON(inputDocMeta, outputDocMeta);
        // now verify the output is the same as the input...

    });

    it("verify output same as input", function () {

        const inputDocMeta = DocMetas.create('0x1234', 2)
        const sparseDocMeta = SparseDocMetas.toSparse(inputDocMeta);

        assert.equal(sparseDocMeta.encodingType, 'sparse');

        const outputDocMeta = SparseDocMetas.fromSparse(sparseDocMeta);

        assertJSON(inputDocMeta, outputDocMeta);
        // now verify the output is the same as the input...

    });


    it("verify dimensions", function () {

        const inputDocMeta = DocMetas.create('0x1234', 2)

        DocMetas.getPageMeta(inputDocMeta, 1).pageInfo.dimensions = {
            width: 800, height: 600
        };
        DocMetas.getPageMeta(inputDocMeta, 2).pageInfo.dimensions = {
            width: 800, height: 600
        };

        const sparseDocMeta = SparseDocMetas.toSparse(inputDocMeta);

        assert.equal(sparseDocMeta.encodingType, 'sparse');

        const outputDocMeta = SparseDocMetas.fromSparse(sparseDocMeta);

        assertJSON(inputDocMeta, outputDocMeta);
        // now verify the output is the same as the input...

    });



    it("verify output same as input for MockDocMeta", function () {

        const inputDocMeta = MockDocMetas.createMockDocMeta('0x1234',)
        const sparseDocMeta = SparseDocMetas.toSparse(inputDocMeta);

        assert.equal(sparseDocMeta.encodingType, 'sparse');

        const outputDocMeta = SparseDocMetas.fromSparse(sparseDocMeta);

        assertJSON(inputDocMeta, outputDocMeta);

        assert.equal(Object.values(inputDocMeta.pageMetas).length, 4);

        assert.equal(Object.values(sparseDocMeta.pageMetas).length, 3);


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
