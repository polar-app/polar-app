import {assert} from 'chai';
import {FilePaths} from './FilePaths';
import {Files} from './Files';
import {URLs} from './URLs';
import fetch from './Fetch';
import {isPresent} from '../Preconditions';

describe('FilePaths', function() {

    describe('toWindowsPath', () => {

        it("basic", async function() {

            assert.equal(FilePaths.toWindowsPath('/tmp/test/hello.txt'), 'C:\\tmp\\test\\hello.txt');

        });

    });

    xdescribe('textToWindowsPath', () => {

        // TODO: these caused bugs on MacOS...

        it("basic", async function() {

            assert.equal(FilePaths.textToWindowsPath('some text /tmp/test/hello.txt then this'), 'some text C:\\tmp\\test\\hello.txt then this');

        });

        it("real world", async function() {

            const text = '     at Function.getCaller (/home/burton/projects/polar-bookshelf/web/js/test/MyTest.jsx:5:17)';
            const expected = '     at Function.getCaller (C:\\home\\burton\\projects\\polar-bookshelf\\web\\js\\test\\MyTest.jsx:5:17)';

            assert.equal(FilePaths.textToWindowsPath(text), expected);

        });

    });

    describe('toExtension', function() {

        it('null and undefined', function() {
            assert.equal(FilePaths.toExtension(null!).isPresent(), false);
            assert.equal(FilePaths.toExtension(undefined!).isPresent(), false);
        });

        it('empty string', function() {
            assert.equal(FilePaths.toExtension("").isPresent(), false);
        });

        it('None', function() {
            assert.equal(FilePaths.toExtension("hello").isPresent(), false);
        });

        it('Basic', function() {
            assert.equal(FilePaths.toExtension("hello.txt").get(), "txt");
        });

        it('Four chars', function() {
            assert.equal(FilePaths.toExtension("hello.html").get(), "html");
        });

    });

    xdescribe('File URLs', async function() {

        xit('Test file URL', async function() {

            const path = FilePaths.createTempName('file-url-data.txt');

            const data = 'hello world';
            await Files.writeFileAsync(path, data);

            const url = FilePaths.toFileURL(path);

            console.log("URL: " + url);

            const response = await fetch(url);

            const buffer = await response.buffer();

            assert.ok(isPresent(buffer), "no buffer");
            assert.equal(data, buffer.toString('utf8'));

        });

    });

});
