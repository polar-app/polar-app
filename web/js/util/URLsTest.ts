
import {assert} from 'chai';
import {TextArray} from './TextArray';
import {URLs} from './URLs';

describe('URLs', function() {

    it("toBase", function() {

        assert.equal(URLs.toBase('http://www.example.com/foo/bar'), 'http://www.example.com');
        assert.equal(URLs.toBase('http://www.example.com:80/foo/bar'), 'http://www.example.com');
        assert.equal(URLs.toBase('http://www.example.com:1234/foo/bar'), 'http://www.example.com:1234');
        assert.equal(URLs.toBase('https://www.example.com:443/foo/bar'), 'https://www.example.com');

    });

    it('absolute', function() {
        assert.equal(URLs.absolute('foo/index.html', 'http://www.example.com'), "http://www.example.com/foo/index.html");
        assert.equal(URLs.absolute('/foo/index.html', 'http://www.example.com'), "http://www.example.com/foo/index.html");
        assert.equal(URLs.absolute('./foo/index.html', 'http://www.example.com'), "http://www.example.com/foo/index.html");
        assert.equal(URLs.absolute('#hello', 'http://www.example.com'), "http://www.example.com/#hello");
    });

    // TODO: this SHOULD work but it was breaking other code.
    // it('absolute between different sites', function() {
    //     assert.equal(URLs.absolute('http://www.microsoft.com', 'http://www.example.com'), "http://www.example.com");
    // });

});
