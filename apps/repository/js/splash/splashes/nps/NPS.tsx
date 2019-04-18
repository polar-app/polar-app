/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Splash} from '../../Splash';
import {SplitLayout, SplitLayoutLeft} from '../../../../../../web/js/ui/split_layout/SplitLayout';
import {SplitLayoutRight} from '../../../../../../web/js/ui/split_layout/SplitLayoutRight';
import {CallToActionLink} from '../components/CallToActionLink';
import {Feedback} from '../../../../../../web/js/ui/feedback/Feedback';
import {Toaster} from '../../../../../../web/js/ui/toaster/Toaster';
import {PREF_KEY} from './NPSRef';
import {LocalStoragePrefs} from '../../../../../../web/js/util/prefs/Prefs';

export class NPS extends React.Component<IProps, IState> {

    private readonly prefs = new LocalStoragePrefs();

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

        // mark it delayed so it's not shown again.
        this.prefs.markDelayed(PREF_KEY, '1w');

    }

}

interface IProps {
}

interface IState {
}

