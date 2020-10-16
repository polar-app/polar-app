import React from 'react';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {
    NetPromoterScore,
    UserFeedback,
    UserFeedbacks
} from '../../../../../web/js/telemetry/UserFeedback';
import {Suggestions} from '../../../../../web/js/ui/feedback/Suggestions';
import {LocalPrefs} from '../../../../../web/js/util/LocalPrefs';
import {SplashKeys} from '../SplashKeys';
import {Version} from 'polar-shared/src/util/Version';
import {MachineIDs} from "polar-shared/src/util/MachineIDs";

export class SuggestionsModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.onSuggestion = this.onSuggestion.bind(this);
    }

    public render() {

        const Description = () => <p>
            We need your help to improve Polar!  In your opinion what should we do to make it better? Please be specific
            as we really do read every one of these and there's a good chance your suggestion will be incorporated
            into a future version of Polar.
        </p>;

        return (

            <Suggestions category={"user-suggestions"}
                         title={"How should we improve Polar?"}
                         description={<Description/>}
                         onDone={text => this.onSuggestion(text)}/>

        );
    }

    private onSuggestion(text: string) {

        // Toaster.success("Thanks for your feedback!");

        const netPromoterScore = LocalPrefs.get(SplashKeys.NET_PROMOTER_SCORE)
            .map(current => Number.parseInt(current))
            .map(current => current as NetPromoterScore)
            .getOrNull();

        // if (netPromoterScore === null) {
        //     RendererAnalytics.event({category: 'suggestions-splash', action: 'no-nps'});
        // }

        const version = Version.get();

        const userFeedback: UserFeedback = {
            machine: MachineIDs.get(),
            text,
            netPromoterScore,
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

