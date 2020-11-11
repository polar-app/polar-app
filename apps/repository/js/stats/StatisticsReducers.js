"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumDatapointsReducer = exports.minDatapointsReducer = exports.firstDatapointsReducer = void 0;
const S2Plus_1 = require("polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus");
exports.firstDatapointsReducer = (timestamp, datapoints) => {
    const first = datapoints[0];
    return Object.assign(Object.assign({}, first), { created: timestamp });
};
exports.minDatapointsReducer = (timestamp, datapoints) => {
    const min = S2Plus_1.StageCountsCalculator.createMutable();
    datapoints.forEach(current => {
        min.nrNew = Math.min(min.nrNew, current.nrNew);
        min.nrLapsed = Math.min(min.nrLapsed, current.nrLapsed);
        min.nrLearning = Math.min(min.nrLearning, current.nrLearning);
        min.nrReview = Math.min(min.nrReview, current.nrReview);
    });
    const first = datapoints[0];
    return Object.assign(Object.assign({}, first), { created: timestamp });
};
exports.sumDatapointsReducer = (timestamp, datapoints) => {
    const sum = S2Plus_1.StageCountsCalculator.createMutable();
    datapoints.forEach(current => {
        sum.nrNew += current.nrNew;
        sum.nrLapsed += current.nrLapsed;
        sum.nrLearning += current.nrLearning;
        sum.nrReview += current.nrReview;
    });
    const first = datapoints[0];
    return Object.assign(Object.assign(Object.assign({}, first), sum), { created: timestamp });
};
//# sourceMappingURL=StatisticsReducers.js.map