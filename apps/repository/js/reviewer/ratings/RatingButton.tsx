import * as React from 'react';
import {TaskRep, TasksCalculator} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {ColorButton} from '../ColorButton';
import {RatingCallback} from "../RatingCallback";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {TimeDurations} from "polar-shared/src/util/TimeDurations";

interface IProps {

    readonly taskRep: TaskRep<any>;
    readonly rating: Rating;
    readonly color: string;
    readonly onRating: RatingCallback<any>;

}

export const RatingButton = deepMemo(function RatingButton(props: IProps) {

    const {rating, taskRep, color} = props;

    // TODO: this isn't returning the right time so we're not really getting exponential
    // backoff.  To fix this just dump the taskRep as JSON and debug from there.  It
    // must not be returning the right value due to the TaskRep data.
    const spacedRep = TasksCalculator.computeNextSpacedRep(taskRep, rating);
    const duration = TimeDurations.format(spacedRep.state.interval);

    return (
        <ColorButton variant="contained"
                     color={color}
                     size="large"
                     style={{flexGrow: 1}}
                     onClick={() => props.onRating(taskRep, rating)}>
            {rating}
        </ColorButton>
    );

});
