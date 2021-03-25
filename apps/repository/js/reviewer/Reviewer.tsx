import * as React from 'react';
import {useReviewerCallbacks} from './ReviewerStore';
import {ReviewerRunner} from "./ReviewerRunner";
import {ReviewerDialog} from "./ReviewerDialog";
import {useLogger} from "../../../../web/js/mui/MUILogger";
import {Reviewers} from "./Reviewers";
import IReviewer = Reviewers.IReviewer;
import {deepMemo} from "../../../../web/js/react/ReactUtils";

export type ReviewerProvider = () => Promise<IReviewer>;

export interface IProps {

    readonly reviewerProvider: ReviewerProvider;

}
export const Reviewer = deepMemo(function Reviewer(props: IProps) {

    const {init} = useReviewerCallbacks();
    const log = useLogger();

    React.useEffect(() => {

        async function doAsync() {
            const reviewer = await props.reviewerProvider();
            // init the store on startup...
            init(reviewer.taskReps, reviewer.doRating, reviewer.doSuspended, reviewer.doFinished);

        }

        doAsync().catch(err => log.error(err));

    }, [init, log, props])

    return (
        <ReviewerDialog className="reviewer">
            <ReviewerRunner/>
        </ReviewerDialog>
    );

})
