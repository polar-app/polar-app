import React from 'react';
import {ReactInjector} from '../../ui/util/ReactInjector';
import {LocalPrefs} from '../../util/LocalPrefs';
import {LifecycleEvents} from '../../ui/util/LifecycleEvents';
import {MobileDisclaimer} from './MobileDisclaimer';
import {Platforms} from '../../util/Platforms';

export class MobileDisclaimers {

    public static createWhenNecessary() {

        if (! (Platforms.type() === 'mobile')) {
            return;
        }

        if (LocalPrefs.isMarked(LifecycleEvents.MOBILE_PREVIEW_WARNING_SHOWN)) {
            return;
        }

        ReactInjector.inject(<MobileDisclaimer/>);

    }

}
