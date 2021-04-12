
import {assert} from 'chai';
import {TextArray} from './TextArray';

describe('TextArray', function() {

    // https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object

    it("Create + toString 1x1", function () {

        assert.equal(new TextArray(1,1).toString(), " \n");

    });

    it("Create + toString 2x2", function () {

        assert.equal(new TextArray(2,2).toString(), "  \n  \n");

    });


    it("Create + toString 2x2", function () {

        assert.equal(new TextArray(2,2).toString(), "  \n  \n");

    });


    it("Create + toString 2x2", function () {

        let textArray = new TextArray(2,2);

        textArray.write(0,0,'h');
        textArray.write(1,0,'i');
        assert.equal(textArray.toString(), "hi\n  \n");

    });

});
