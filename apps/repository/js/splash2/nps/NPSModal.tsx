/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Feedback} from '../../../../../web/js/ui/feedback/Feedback';
import {Toaster} from '../../../../../web/js/ui/toaster/Toaster';
import {NPS} from './NPS';

export class NPSModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.onRated = this.onRated.bind(this);
    }

    public render() {

        return (

            <Feedback category='net-promoter-score'
                      title='How likely are you to recommend Polar?'
                      from="Not likely"
                      to="Very likely"
                      onRated={() => this.onRated()}/>

        );
    }

    private onRated() {

        Toaster.success("Thanks for your feedback!");

        NPS.markShown();

    }

}

interface IProps {
}

interface IState {
}

