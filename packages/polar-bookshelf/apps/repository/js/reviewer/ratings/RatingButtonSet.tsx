import * as React from 'react';
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {RatingButton} from './RatingButton';
import {useReviewerStore} from "../ReviewerStore";
import {ITaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/ITaskRep";
import {ITaskAction} from "../ITaskAction";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    root: {

        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',

        "& > *": {
            marginLeft: theme.spacing(2)
        },

        "& > *:first-child": {
            marginLeft: 0
        }
    },

}));


export interface IProps {
    readonly taskRep: ITaskRep<ITaskAction>;
    readonly options: ReadonlyArray<IRatingOption>;
}

export interface IRatingOption {
    readonly rating: Rating;
    readonly color: string;
}

export const RatingButtonSet = function(props: IProps) {

    const {options, taskRep} = props;
    const store = useReviewerStore();

    const classes = useStyles();

    const handleRating = React.useCallback((taskRep: ITaskRep<ITaskAction>, rating: Rating) => {
        store.onRating(taskRep, rating);
    }, [store]);

    return (
        <div className={classes.root}>

            {options.map(option => (
                <RatingButton key={option.rating}
                              taskRep={taskRep}
                              rating={option.rating}
                              color={option.color}
                              onRating={() => handleRating(taskRep, option.rating)}/>
                ))}

        </div>
    );

}
