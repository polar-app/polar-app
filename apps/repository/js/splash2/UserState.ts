/**
 * High level information about this user including the time their datastore
 * was created, their 'level', etc.
 */
import {ISODateTimeString} from '../../../../web/js/metadata/ISODateTimeStrings';

export interface UserState {

    readonly datastoreCreated: ISODateTimeString;

}
