import {ScaleLevelTuples, PDFScales} from "./ScaleLevels";
import {assertJSON} from "../../../web/js/test/Assertions";
import {assert} from 'chai';
import {Arrays} from "polar-shared/src/util/Arrays";

describe('ScaleLevels', function() {

    it("basic", function() {

        // assertJSON(PDFScales.computeNextZoomLevel(0, ScaleLevelTuples[1]), {
        //     "label": "page width",
        //     "value": "page-width"
        // });

        // assertJSON(PDFScales.computeNextZoomLevel('+', ScaleLevelTuples[1]), {
        //     "label": "50%",
        //     "value": "0.5"
        // });
        //
        // assertJSON(PDFScales.computeNextZoomLevel('-', ScaleLevelTuples[1]), {
        //     "label": "page fit",
        //     "value": "page-fit"
        // });
        //
        // assert.isUndefined(PDFScales.computeNextZoomLevel('-', Arrays.first(ScaleLevelTuples)!));
        // assert.isUndefined(PDFScales.computeNextZoomLevel('+', Arrays.last(ScaleLevelTuples)!));

    });

});
