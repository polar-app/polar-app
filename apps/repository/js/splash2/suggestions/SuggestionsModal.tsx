/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Feedback} from '../../../../../web/js/ui/feedback/Feedback';
import {Rating} from '../../../../../web/js/ui/feedback/Feedback';
import {Toaster} from '../../../../../web/js/ui/toaster/Toaster';
import {MachineIDs} from '../../../../../web/js/util/MachineIDs';
import {ISODateTimeStrings} from '../../../../../web/js/metadata/ISODateTimeStrings';
import {UserFeedbacks} from '../../../../../web/js/telemetry/UserFeedback';
import {Suggestions} from '../../../../../web/js/ui/feedback/Suggestions';

export class SuggestionsModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.onRated = this.onRated.bind(this);
    }

    public render() {

        return (


            <Suggestions category={"user-suggestions"}
                         title={"How should we improve Polar?"}
                         description="We need your help to improve Polar!  In your opinion what should we do to make it better?"/>

        );
    }

    private onRated(rating: Rating) {

        Toaster.success("Thanks for your feedback!");

        // FIXME: we have to use the cached value of the NPS now.

        const userFeedback = {
            machine: MachineIDs.get(),
            text: null,
            netPromoterScore: rating,
            created: ISODateTimeStrings.create()
        };

        UserFeedbacks.write(userFeedback)
            .catch(err => console.error("Unable to write user feedback: ", err));

    }
}

interface IProps {
}

interface IState {
}

