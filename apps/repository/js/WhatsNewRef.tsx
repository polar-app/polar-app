import {GithubStars} from './splash/splashes/github_stars/GithubStars';
import * as React from 'react';
import {WhatsNewModal} from './WhatsNewModal';
import {PrioritizedComponentRef} from '../../../web/js/ui/prioritized/PrioritizedComponentManager';
import {Version} from '../../../web/js/util/Version';
import {RendererAnalytics} from '../../../web/js/ga/RendererAnalytics';
import {ConditionalSetting} from '../../../web/js/ui/util/ConditionalSetting';
import {Providers} from '../../../web/js/util/Providers';

export class WhatsNewRef implements PrioritizedComponentRef {

    constructor() {
        this.priority = Providers.memoize(this.priority);
    }

    public priority(): number | undefined {

        const conditionalSetting = new ConditionalSetting('polar-whats-new-version');

        const version = Version.get();

        const isNewVersion = conditionalSetting.get().getOrElse('') !== version;

        console.log("FIXME: isNewVersion: ", isNewVersion);

        if (isNewVersion) {
            RendererAnalytics.event({category: 'app', action: 'whats-new-displayed'});
        }

        // set it automatically it's only shown once
        conditionalSetting.set(version);

        if (isNewVersion) {
            return 1000;
        }

        return undefined;

    }

    public create(): JSX.Element {
        return <WhatsNewModal/>;
    }

}
