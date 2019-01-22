import {BufferExportWriter} from './BufferExportWriter';
import {assert} from 'chai';

describe('BufferExportWriter', function() {

    it("basic", async function() {

        const writer = new BufferExportWriter();

        await writer.write("hello");
        await writer.write("world");

        await writer.close();

        assert.equal(writer.toString(), "helloworld");

    });

    it("no data", async function() {

        const writer = new BufferExportWriter();

        await writer.close();

        assert.equal(writer.toString(), "");

    });

    it("one write", async function() {

        const writer = new BufferExportWriter();
        await writer.write("hello");

        await writer.close();

        assert.equal(writer.toString(), "hello");

    });




});

