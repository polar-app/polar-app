import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {PrioritizedComponentManager, PrioritizedComponentRef} from '../../../../web/js/ui/prioritized/PrioritizedComponentManager';
import {WhatsNewRef} from './splashes/whats_new/WhatsNewRef';
import {SurveyRef} from './splashes/survey/SurveyRef';
import {PremiumRef} from './splashes/premium/PremiumRef';
import {ChromeExtensionReviewRef} from './splashes/chrome_extension_review/ChromeExtensionReviewRef';
import {LocalPrefs} from '../../../../web/js/ui/util/LocalPrefs';
import {SplashLifecycle} from './SplashLifecycle';

const log = Logger.create();

const prioritizedComponentRefs: PrioritizedComponentRef[] = [
    // new JoinDiscordRef(),
    new WhatsNewRef(),
    // new GithubStarsRef(),
    new PremiumRef(),
    new SurveyRef(),
    new ChromeExtensionReviewRef(),
];

export class PrioritizedSplashes extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        // FIXME: setup a background thread to bring up the splashes in the
        // background by setting the state in a background thread when the
        // splash shown has expired.

        return (
            <PrioritizedComponentManager prioritizedComponentRefs={prioritizedComponentRefs}/>
        );

    }

}

interface IProps {
}

interface IState {
}


