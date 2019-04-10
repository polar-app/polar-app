import * as React from 'react';
import {NPS} from './NPS';
import {PrioritizedComponentRef} from '../../../../../../web/js/ui/prioritized/PrioritizedComponentManager';
import {DatastoreOverview} from '../../../../../../web/js/datastore/Datastore';

export class NPSRef implements PrioritizedComponentRef {

    public id: string = 'nps';

    public create(): JSX.Element {
        return <NPS/>;
    }

    public priority(datastoreOverview: DatastoreOverview): number | undefined {

        // need to look at both the day the user added it plus

        return undefined;

    }

}
