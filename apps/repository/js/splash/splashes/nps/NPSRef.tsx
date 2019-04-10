import * as React from 'react';
import {NPS} from './NPS';
import {PrioritizedComponentRef} from '../../../../../../web/js/ui/prioritized/PrioritizedComponentManager';
import {DatastoreOverview} from '../../../../../../web/js/datastore/Datastore';
import {ISODateTimeStrings} from '../../../../../../web/js/metadata/ISODateTimeStrings';
import {TimeDurations} from '../../../../../../web/js/util/TimeDurations';
import {LocalStoragePrefs} from '../../../../../../web/js/util/prefs/Prefs';

const PRIORITY = 75;

export const PREF_KEY = 'net-promoter-score';

export class NPSRef implements PrioritizedComponentRef {

    public id: string = 'nps';

    private readonly prefs = new LocalStoragePrefs();

    public create(): JSX.Element {
        return <NPS/>;
    }

    public priority(datastoreOverview: DatastoreOverview): number | undefined {

        if (datastoreOverview.created) {

            const since = ISODateTimeStrings.parse(datastoreOverview.created);

            if (TimeDurations.hasElapsed(since, '1w')) {

                if (! this.prefs.isMarkedDelayed(PREF_KEY)) {
                    return PRIORITY;
                }

            }

        }

        // need to look at both the day the user added it plus

        return undefined;

    }

}
