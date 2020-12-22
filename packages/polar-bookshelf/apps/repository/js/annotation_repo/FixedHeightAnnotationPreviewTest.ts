import {assertJSON} from "../../../../web/js/test/Assertions";
import {calculateTextPreviewHeight} from "./FixedHeightAnnotationPreview";

describe('FixedHeightAnnotationPreview', function() {

    describe('calculateTextPreviewHeight', function() {

        it("basic", function () {
            assertJSON(calculateTextPreviewHeight("asdf"), {});
        });

    });

});
