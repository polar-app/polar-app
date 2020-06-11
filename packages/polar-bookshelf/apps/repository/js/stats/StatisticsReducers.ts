import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {SpacedRepStat, SpacedRepStatRecord} from "polar-firebase/src/firebase/om/SpacedRepStats";
import {StageCountsCalculator} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

export const firstDatapointsReducer = (timestamp: ISODateTimeString,
                                       datapoints: ReadonlyArray<SpacedRepStatRecord>): SpacedRepStatRecord => {

    const first = datapoints[0];
    return {
        ...first,
        created: timestamp
    };
};

export const minDatapointsReducer = (timestamp: ISODateTimeString,
                                     datapoints: ReadonlyArray<SpacedRepStat>): SpacedRepStat => {

    const min = StageCountsCalculator.createMutable();

    datapoints.forEach(current => {
        min.nrNew = Math.min(min.nrNew, current.nrNew);
        min.nrLapsed = Math.min(min.nrLapsed, current.nrLapsed);
        min.nrLearning = Math.min(min.nrLearning, current.nrLearning);
        min.nrReview = Math.min(min.nrReview, current.nrReview);
    });

    const first = datapoints[0];
    return {
        ...first,
        created: timestamp
    };
};

export const sumDatapointsReducer = (timestamp: ISODateTimeString,
                                     datapoints: ReadonlyArray<SpacedRepStat>): SpacedRepStat => {

    const sum = StageCountsCalculator.createMutable();

    datapoints.forEach(current => {
        sum.nrNew += current.nrNew;
        sum.nrLapsed += current.nrLapsed;
        sum.nrLearning += current.nrLearning;
        sum.nrReview += current.nrReview;
    });

    const first = datapoints[0];

    return {
        ...first,
        ...sum,
        created: timestamp
    };

};

