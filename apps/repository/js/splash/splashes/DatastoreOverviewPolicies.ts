import {DatastoreOverview} from '../../../../../web/js/datastore/Datastore';
import {TimeDurations} from '../../../../../web/js/util/TimeDurations';
import {ISODateTimeStrings} from '../../../../../web/js/metadata/ISODateTimeStrings';


// TODO: we need events for these on startup... it would be nice to see how many
// users were onboarded
export class DatastoreOverviewPolicies {

    public static isLevel(level: UserLevel, datastoreOverview: DatastoreOverview) {

        switch (level) {

            case 'active':
                return this.isActive(datastoreOverview);

            case 'premium':
                return this.isPremium(datastoreOverview);

        }

    }

    /**
     * The user has onboarded and has been using the app for a while.
     */
    public static isActive(datastoreOverview: DatastoreOverview) {

        const since = ISODateTimeStrings.parse(datastoreOverview.created);
        return TimeDurations.hasExceeded(since, '1w') && datastoreOverview.nrDocs > 5;

    }

    /**
     * The user is at a premium level but may or may not have converted to premium.
     */
    public static isPremium(datastoreOverview: DatastoreOverview) {

        const since = ISODateTimeStrings.parse(datastoreOverview.created);
        return TimeDurations.hasExceeded(since, '2w') && datastoreOverview.nrDocs > 25;

    }

}

export type UserLevel = 'active' | 'premium';
