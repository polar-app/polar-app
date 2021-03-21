import React from 'react';
import {Feedback, Rating} from '../../../../../web/js/ui/feedback/Feedback';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {UserFeedbacks} from '../../../../../web/js/telemetry/UserFeedback';
import {SplashKeys} from '../SplashKeys';
import {LocalPrefs} from '../../../../../web/js/util/LocalPrefs';
import {Version} from 'polar-shared/src/util/Version';
import {MachineIDs} from "polar-shared/src/util/MachineIDs";

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
                      onRated={(rating) => this.onRated(rating)}/>

        );
    }

    private onRated(rating: Rating) {

        LocalPrefs.set(SplashKeys.NET_PROMOTER_SCORE, rating);

        // Toaster.success("Thanks for your feedback!");

        const version = Version.get();

        const userFeedback = {
            machine: MachineIDs.get(),
            text: null,
            netPromoterScore: rating,
            created: ISODateTimeStrings.create(),
            version

        };

        UserFeedbacks.write(userFeedback)
            .catch(err => console.error("Unable to write user feedback: ", err));

    }
}

interface IProps {
}

interface IState {
}

