import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {Version} from '../../../../web/js/util/Version';
import {app} from 'electron';
import {FilePaths} from '../../../../web/js/util/FilePaths';
import {Files} from '../../../../web/js/util/Files';
import {Logger} from '../../../../web/js/logger/Logger';
import {PrioritizedComponentManager, PrioritizedComponentRef} from '../../../../web/js/ui/prioritized/PrioritizedComponentManager';
import {PrioritizedComponent} from '../../../../web/js/ui/prioritized/PrioritizedComponentManager';
import {GithubStars} from './splashes/github_stars/GithubStars';
import {GithubStarsRef} from './splashes/github_stars/GithubStarsRef';
import {WhatsNewRef} from './splashes/whats_new/WhatsNewRef';
import {SurveyRef} from './splashes/survey/SurveyRef';
// import {JoinDiscordRef} from './splashes/discord/JoinDiscordRef';

const log = Logger.create();

const prioritizedComponentRefs: PrioritizedComponentRef[] = [
    // new JoinDiscordRef(),
    new WhatsNewRef(),
    new GithubStarsRef(),
    new SurveyRef()
];

export class PrioritizedSplashes extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        if (SplashLifecycle.canShow()) {

            // FIXME: I need to break apart app for now..
            // SplashLifecycle.markShown();

            return (
                <PrioritizedComponentManager prioritizedComponentRefs={prioritizedComponentRefs}/>
            );

        } else {

            return (
                <div/>
            );

        }

    }

}

export class SplashLifecycle {

    private static KEY = 'splash-shown';

    public static canShow(): boolean {
        return window.sessionStorage.getItem(this.KEY) !== 'true';
    }

    public static markShown() {
        window.sessionStorage.setItem(this.KEY, 'true');
    }

}

interface IProps {
}

interface IState {
}


