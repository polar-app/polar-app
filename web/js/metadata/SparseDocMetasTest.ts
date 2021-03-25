import {assert} from 'chai';
import { Files } from 'polar-shared/src/util/Files';
import { IDimensions } from 'polar-shared/src/util/IDimensions';
import { assertJSON } from '../test/Assertions';
import {DocMetas, MockDocMetas} from "./DocMetas";
import {SparseDimensions, SparseDocMetas} from "./SparseDocMetas";

// TODO:
//
// what else to test:
//
// - test it on all my personal docMeta and verify input and output and verify
//   that this works reliably and that we get solid compression.
//
// - enable it for my account / locally.

describe('SparseDocMetas', function() {

    const enabled = DocMetas.ENABLE_SPARSE_DOC_SERIALIZE;

    beforeEach(() => {
        DocMetas.ENABLE_SPARSE_DOC_SERIALIZE = true;
    });

    afterEach(() => {
        DocMetas.ENABLE_SPARSE_DOC_SERIALIZE = enabled;
    });

    it("size without making sparse", function () {

        const docMeta = DocMetas.create('0x1234', 7500);

        const json = DocMetas.serialize(docMeta);

        assert.equal(json.length, 443)

    });

    // 394 bytes to 150k...

    it("size as sparse", function () {

        const inputDocMeta = DocMetas.create('0x1234', 7500)
        const sparseDocMeta = SparseDocMetas.toSparse(inputDocMeta);

        assert.equal(sparseDocMeta.encodingType, 'sparse');

        const json = JSON.stringify(sparseDocMeta);

        assert.equal(json.length, 349)

    });

    it("Make sure pageMeta works", function () {

        const inputDocMeta = DocMetas.create('0x1234', 7500)
        const sparseDocMeta = SparseDocMetas.toSparse(inputDocMeta);
        const docMeta = SparseDocMetas.fromSparse(sparseDocMeta);

        for (let pageNum = 1; pageNum <= docMeta.docInfo.nrPages; ++pageNum) {
            const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);
            assert.equal(pageMeta.pageInfo.num, pageNum);
        }

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

    xdescribe('existing data', function() {

        this.timeout(60000);

        it("basic", async function () {

            async function handlePath(path: string) {

                if (! path.endsWith('state.json')) {
                    return;
                }

                const buff = await Files.readFileAsync(path);
                const content = buff.toString('utf-8');

                const inputDocMeta = DocMetas.deserialize(content, '0x1235');

                const sparseDocMeta = SparseDocMetas.toSparse(inputDocMeta);

                const outputDocMeta = SparseDocMetas.fromSparse(sparseDocMeta);

                assertJSON(inputDocMeta, outputDocMeta);

                const before = JSON.stringify(inputDocMeta).length;
                const after = JSON.stringify(sparseDocMeta).length

                const reduction = ((after / before) * 100);

                console.log("reduction: " , reduction);

            }

            await Files.recursively("/Users/burton/.polar", handlePath);


        });

    });


});
