import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "./Reviewer";
import {Stage} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {RatingButton} from "./RatingButton";

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
            return [
                <RatingButton taskRep={this.props.taskRep} rating='again' onRating={this.props.onRating}/>,
                <RatingButton taskRep={this.props.taskRep} rating='good' onRating={this.props.onRating}/>,
                <RatingButton taskRep={this.props.taskRep} rating='easy' onRating={this.props.onRating}/>
            ];
        }

    };

    static Review = class extends React.Component<IProps, any> {

        public render() {
            return [
                <RatingButton taskRep={this.props.taskRep} rating='again' onRating={this.props.onRating}/>,
                <RatingButton taskRep={this.props.taskRep} rating='hard' onRating={this.props.onRating}/>,
                <RatingButton taskRep={this.props.taskRep} rating='good' onRating={this.props.onRating}/>,
                <RatingButton taskRep={this.props.taskRep} rating='easy' onRating={this.props.onRating}/>
            ];
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
