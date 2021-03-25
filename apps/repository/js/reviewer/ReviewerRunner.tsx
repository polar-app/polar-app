import * as React from 'react';
import {Percentages} from "polar-shared/src/util/Percentages";
import {ReviewFinished} from "./ReviewFinished";
import LinearProgress from "@material-ui/core/LinearProgress";
import {ReviewerCard} from "./cards/ReviewerCard";
import {useReviewerStore} from './ReviewerStore';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {MUILoading} from "../../../../web/js/mui/MUILoading";

export const ReviewerRunner = deepMemo(function ReviewerRunner() {

    const {taskRep, finished, total, initialized} = useReviewerStore(['taskRep', 'finished', 'total', 'initialized']);

    if (! initialized) {
        // we're still loading
        return <MUILoading/>;
    }

    if (! taskRep) {

        // no more task reps... we're finished.
        return (
            <ReviewFinished/>
        );

    }

    const perc = Math.floor(Percentages.calculate(finished, total));

    return (
        <>
            <div className="mb-1">

                <LinearProgress variant="determinate"
                                color="primary"
                                value={perc}/>

            </div>

            <ReviewerCard key={taskRep.id}
                          taskRep={taskRep}/>

        </>

    );

});
