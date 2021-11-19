import {assertJSON} from "polar-test/src/test/Assertions";
import {calculateTextPreviewHeight} from "./FixedHeightAnnotationPreview";

describe('FixedHeightAnnotationPreview', function() {

    describe('calculateTextPreviewHeight', function() {

        it("basic", function () {
            assertJSON(calculateTextPreviewHeight("asdf"), {
                "height": 20,
                "maxTextLength": 32,
                "nrRowsForTextPX": 1
            });
        });

    });

});
