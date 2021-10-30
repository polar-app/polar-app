import * as React from 'react';
import {Percentages} from "polar-shared/src/util/Percentages";
import {ReviewFinished} from "./ReviewFinished";
import LinearProgress from "@material-ui/core/LinearProgress";
import {ReviewerCard} from "./cards/ReviewerCard";
import {ReviewerStore, ReviewerStoreContext} from './ReviewerStore';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {observer} from 'mobx-react-lite';
import {MUILoading} from "../../../../web/js/mui/MUILoading";
import {ITaskAction} from './ReviewerTasks';

interface IReviewerRunnerProps {
    store: ReviewerStore<ITaskAction> | undefined;
}

export const ReviewerRunner = deepMemo(observer(function ReviewerRunner(props: IReviewerRunnerProps) {

    const { store } = props;

    if (! store) {
        return <MUILoading />
    }

    if (! store.currentTaskRep) {

        // no more task reps... we're finished.
        return <ReviewFinished/>;

    }

    const perc = Math.floor(Percentages.calculate(store.finished, store.total));

    return (
        <ReviewerStoreContext.Provider value={store}>
            <div className="mb-1">

                <LinearProgress variant="determinate"
                                color="primary"
                                value={perc}/>

            </div>

            <ReviewerCard key={store.currentTaskRep.id}
                          taskRep={store.currentTaskRep}/>

        </ReviewerStoreContext.Provider>

    );

}));
