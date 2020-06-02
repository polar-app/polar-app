import {ScaleLevelTuples, PDFScales} from "./PDFScaleLevels";
import {assertJSON} from "../../../web/js/test/Assertions";
import {assert} from 'chai';
import {Arrays} from "polar-shared/src/util/Arrays";

describe('PDFScaleLevels', function() {

    it("basic", function() {

        assertJSON(PDFScales.computeNextZoomLevel(0, ScaleLevelTuples[1]), {
            "label": "page fit",
            "value": "page-fit"
        });

        assertJSON(PDFScales.computeNextZoomLevel(1, ScaleLevelTuples[1]), {
            "label": "50%",
            "value": "0.5"
        });

        assertJSON(PDFScales.computeNextZoomLevel(-1, ScaleLevelTuples[1]), {
            "label": "page width",
            "value": "page-width"
        });

        assert.isUndefined(PDFScales.computeNextZoomLevel(-1, Arrays.first(ScaleLevelTuples)!));
        assert.isUndefined(PDFScales.computeNextZoomLevel(1, Arrays.last(ScaleLevelTuples)!));

    });

});
