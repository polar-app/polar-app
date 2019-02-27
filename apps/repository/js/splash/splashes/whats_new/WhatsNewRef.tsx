import * as React from 'react';
import {WhatsNewModal} from './WhatsNewModal';
import {PrioritizedComponentRef} from '../../../../../../web/js/ui/prioritized/PrioritizedComponentManager';
import {Version} from '../../../../../../web/js/util/Version';
import {RendererAnalytics} from '../../../../../../web/js/ga/RendererAnalytics';
import {ConditionalSetting} from '../../../../../../web/js/ui/util/ConditionalSetting';
import {Providers} from '../../../../../../web/js/util/Providers';
import {LifecycleToggle} from '../../../../../../web/js/ui/util/LifecycleToggle';
import {LifecycleEvents} from '../../../../../../web/js/ui/util/LifecycleEvents';
import * as semver from 'semver';
import {DatastoreOverview} from '../../../../../../web/js/datastore/Datastore';

export class WhatsNewRef implements PrioritizedComponentRef {

    public readonly id = 'whats-new';

    constructor() {
        this.priority = Providers.memoize(this.priority.bind(this));
    }

    public priority(datastoreOverview: DatastoreOverview): number | undefined {

        const hasTourTerminated = this.hasTourTerminated();

        const isNewVersion = this.isNewVersion();

        // set it automatically it's only shown once
        this.markVersion();

        if (isNewVersion && hasTourTerminated) {

            // TODO: this isn't actually correct to issue the event here as it
            // might not be displayed since we're just handing out the priority
            // not necessarily displaying it.
            RendererAnalytics.event({category: 'app', action: 'whats-new-displayed'});

            return 1000;
        }

        return undefined;

    }

    private hasTourTerminated() {
        return LifecycleToggle.isMarked(LifecycleEvents.TOUR_TERMINATED);
    }

    private isNewVersion(): boolean {

        const version = Version.get();

        const prevVersion =
            LifecycleToggle.get(LifecycleEvents.WHATS_NEW_VERSION)
                .getOrElse(version);

        // TODO: this needs semver... from WhatsNewComponent (which is now deprecated)
        return prevVersion !== version;

    }

    private markVersion() {
        const version = Version.get();
        LifecycleToggle.set(LifecycleEvents.WHATS_NEW_VERSION, version);
    }

    public create(): JSX.Element {
        return <WhatsNewModal/>;
    }

}

