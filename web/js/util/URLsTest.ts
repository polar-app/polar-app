
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

});
