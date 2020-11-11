"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScaleLevelTuplesMap = exports.ScaleLevelTuples = exports.SCALE_VALUE_PAGE_WIDTH = exports.SCALE_VALUE_PAGE_FIT = exports.PDFScales = void 0;
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Arrays_1 = require("polar-shared/src/util/Arrays");
var PDFScales;
(function (PDFScales) {
    function computeNextZoomLevel(delta, currentScaleValue) {
        if (currentScaleValue === undefined) {
            return undefined;
        }
        const discreteScaleLevelTuples = exports.ScaleLevelTuples.filter(current => !isNaN(parseFloat(current.value)));
        const discreteZoomLevels = discreteScaleLevelTuples.map(current => parseFloat(current.value));
        const predicate = delta === '+' ? (scaleValue) => scaleValue > currentScaleValue :
            (scaleValue) => scaleValue < currentScaleValue;
        const filteredDiscreteZoomLevels = ArrayStreams_1.arrayStream(discreteZoomLevels)
            .filter(predicate)
            .collect();
        const sortedZoomLevels = ArrayStreams_1.arrayStream(filteredDiscreteZoomLevels)
            .sort((a, b) => a - b)
            .collect();
        const newZoomLevel = delta === '+' ? Arrays_1.Arrays.first(sortedZoomLevels) : Arrays_1.Arrays.last(sortedZoomLevels);
        if (newZoomLevel) {
            return ArrayStreams_1.arrayStream(exports.ScaleLevelTuples)
                .filter(current => current.value === `${newZoomLevel}`)
                .first();
        }
        else {
            switch (delta) {
                case "+":
                    return Arrays_1.Arrays.last(discreteScaleLevelTuples);
                case "-":
                    return Arrays_1.Arrays.first(discreteScaleLevelTuples);
            }
        }
    }
    PDFScales.computeNextZoomLevel = computeNextZoomLevel;
})(PDFScales = exports.PDFScales || (exports.PDFScales = {}));
exports.SCALE_VALUE_PAGE_FIT = {
    label: 'page fit',
    value: 'page-fit'
};
exports.SCALE_VALUE_PAGE_WIDTH = {
    label: 'page width',
    value: 'page-width'
};
exports.ScaleLevelTuples = [
    exports.SCALE_VALUE_PAGE_FIT,
    exports.SCALE_VALUE_PAGE_WIDTH,
    {
        label: '50%',
        value: '0.5'
    },
    {
        label: '60%',
        value: '0.6'
    },
    {
        label: '70%',
        value: '0.7'
    },
    {
        label: '80%',
        value: '0.8'
    },
    {
        label: '90%',
        value: '0.9'
    },
    {
        label: '100%',
        value: '1'
    },
    {
        label: '110%',
        value: '1.1'
    },
    {
        label: '130%',
        value: '1.3'
    },
    {
        label: '150%',
        value: '1.5'
    },
    {
        label: '170%',
        value: '1.7'
    },
    {
        label: '190%',
        value: '1.9'
    },
    {
        label: '200%',
        value: '2'
    },
    {
        label: '210%',
        value: '2.1'
    },
    {
        label: '240%',
        value: '2.4'
    },
    {
        label: '270%',
        value: '2.7'
    },
    {
        label: '300%',
        value: '3'
    },
    {
        label: '330%',
        value: '3.3'
    },
    {
        label: '370%',
        value: '3.7'
    },
    {
        label: '400%',
        value: '4'
    }
];
exports.ScaleLevelTuplesMap = ArrayStreams_1.arrayStream(exports.ScaleLevelTuples).toMap(current => current.label);
//# sourceMappingURL=ScaleLevels.js.map