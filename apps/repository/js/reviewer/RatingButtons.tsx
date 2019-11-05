import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "./Reviewer";
import {Stage} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {RatingButtonSet} from "./RatingButtonSet";

export class RatingButtons extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        if (['new', 'learning'].includes(this.props.stage)) {
            return <RatingButtons.Learning {...this.props}/>;
        } else {
            return <RatingButtons.Review {...this.props}/>;
        }

    }

    static Learning = class extends React.Component<IProps, any> {

        public render() {
            return <RatingButtonSet taskRep={this.props.taskRep}
                                    ratings={['again', 'good', 'easy']}
                                    onRating={this.props.onRating}/>;
        }

    };

    static Review = class extends React.Component<IProps, any> {

        public render() {
            return <RatingButtonSet taskRep={this.props.taskRep}
                                    ratings={['again', 'hard', 'good', 'easy']}
                                    onRating={this.props.onRating}/>;
        }

    };

}

export interface IProps {

    readonly taskRep: TaskRep;
    readonly stage: Stage;
    readonly onRating: RatingCallback;

}

export interface IState {

}
